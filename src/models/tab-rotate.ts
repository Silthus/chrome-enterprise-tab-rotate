import { Config } from './config'
import { ITabRotationConfig, TabRotationConfig } from './tab-rotation-config'
import { tap, switchMap, catchError, filter, map } from 'rxjs/operators'
import { timer, of, Subject, Observable } from 'rxjs'
import { TabRotateSession } from './tab-rotate-session'
import deepEqual from 'deep-equal'

export interface ITabRotationStatus {
  status: 'running' | 'stopped' | 'error' | 'paused' | 'waiting';
  message?: string;
}

export class TabRotator {
  private readonly _options = new Config();
  private _config: ITabRotationConfig;
  private _session: TabRotateSession;
  private _initialized = false;
  private _statusChanged = new Subject<ITabRotationStatus>();

  public get StatusChanged (): Observable<ITabRotationStatus> {
    return this._statusChanged.asObservable()
  }

  public get isStarted (): boolean {
    return this._session !== undefined
  }

  public get isActive (): boolean {
    return this._session !== undefined && this._session.isActive
  }

  public get isPaused (): boolean {
    return this._session !== undefined && this._session.paused
  }

  constructor () {
    console.log('new TabRotate()')

    chrome.storage.onChanged.addListener(() => {
      this._options.load()
    })

    this.StatusChanged.subscribe(status => console.log(status))
  }

  public init (): Promise<ITabRotationConfig> {
    console.log('init()')

    const result = new Promise(resolve => {
      this._options.ConfigLoaded.pipe(
        tap(config => {
          console.log('loaded tab rotate config... - reload interval: ' + +config.reloadInterval * 1000 + 'ms')
          console.log(config)
        }),
        switchMap(config =>
          timer(0, +config.reloadInterval * 1000).pipe(
            switchMap(() => config.getTabRotationConfig()),
            catchError(error => {
              console.error(error)
              return of(undefined)
            })
          )
        ),
        map(config => new TabRotationConfig(config)),
        filter(config => !deepEqual(this._config, config)),
        tap(config => {
          console.log('reloaded website config...')
          console.log(config)
        })
      ).subscribe(config => {
        this._config = config

        if (this._config.autoStart) {
          if (this._initialized) {
            this.reload()
          } else {
            this.start()
          }
        } else {
          this.stop()
        }

        this._initialized = true

        resolve()
      })
    })

    this._options.load()

    return result
  }

  public start (): ITabRotationStatus {
    console.log('start()')
    let status: ITabRotationStatus

    if (this._config === undefined) {
      status = { status: 'error', message: 'cannot start tab rotation: config is undefined.' }
      this._statusChanged.next(status)
      return status
    };
    if (this._session && this._session.isActive) return this.reload()

    this._session = new TabRotateSession(this._config)
    this._session.load().then(() => {
      this._session.start()
      status = { status: 'running' }
      this._statusChanged.next(status)
    })
  }

  public reload (): ITabRotationStatus {
    console.log('reload()')
    if (this._config === undefined) {
      return this.stop()
    } else if (!this._session) {
      const status: ITabRotationStatus = { status: 'error', message: 'tab rotation not running - cannot reload' }
      this._statusChanged.next(status)
      return status
    }

    this.stop()
    this.start()
  }

  public stop (): ITabRotationStatus {
    console.log('stop()')
    if (this._session) this._session.stop()
    this._session = undefined

    const status: ITabRotationStatus = { status: 'stopped' }
    this._statusChanged.next(status)

    return status
  }

  public pause (): ITabRotationStatus {
    console.log('pause()')
    if (this._session) {
      this._session.pause()
      const status: ITabRotationStatus = { status: 'paused' }
      this._statusChanged.next(status)
      return status
    }

    const status: ITabRotationStatus = { status: 'error', message: 'Tab rotation not running - cannot pause' }
    this._statusChanged.next(status)

    return status
  }

  public resume (): ITabRotationStatus {
    console.log('resume()')
    if (!this._session) {
      const status: ITabRotationStatus = { status: 'error', message: 'Tab rotation not running - cannot resume' }
      this._statusChanged.next(status)

      return status
    } else if (!this._session.paused) {
      const status: ITabRotationStatus = { status: 'running' }
      this._statusChanged.next(status)
      return status
    }
    this._session.start()
  }
}
