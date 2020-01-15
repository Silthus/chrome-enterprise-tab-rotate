import { Config } from './config';
import { ITabRotationConfig, TabRotationConfig } from "./tab-rotation-config";
import { tap, switchMap, catchError, filter, map } from 'rxjs/operators';
import { timer, of, Subject, Observable } from 'rxjs';
import { TabRotateSession } from './tab-rotate-session';
import deepEqual from 'deep-equal';

export interface TabRotationStatus {
  status: 'running' | 'stopped' | 'error' | 'paused' | 'waiting';
  message?: string;
}

export class TabRotator {

  private readonly _options = new Config();
  private _config: ITabRotationConfig;
  private _session: TabRotateSession;
  private _initialized = false;
  private _statusChanged = new Subject<TabRotationStatus>();

  public get StatusChanged(): Observable<TabRotationStatus> {
    return this._statusChanged.asObservable();
  }

  public get isStarted(): boolean {
    return this._session !== undefined;
  }

  public get isActive(): boolean {
    return this._session !== undefined && this._session.isActive;
  }

  public get isPaused(): boolean {
    return this._session !== undefined && this._session.paused;
  }

  constructor() {

    console.log("new TabRotate()");

    chrome.storage.onChanged.addListener(() => {
      this._options.load();
    });

    this.StatusChanged.subscribe(status => console.log(status));
  }

  public init() { 

    console.log("init()");

    this._options.ConfigLoaded.pipe(
      tap(config => {
        console.log("loaded tab rotate config... - reload interval: " + +config.reload_interval * 1000 + "ms")
        console.log(config);
      }),
      switchMap(config =>
        timer(0, +config.reload_interval * 1000).pipe(
          switchMap(() => config.getTabRotationConfig()),
          catchError(error => {
            console.error(error);
            return of(undefined);
          })
        )
      ),
      map(config => new TabRotationConfig(config)),
      filter(config => !deepEqual(this._config, config)),
      tap(config => {
        console.log("reloaded website config...");
        console.log(config);
      })
    ).subscribe(config => {
      this._config = config;

      if (this._config.autoStart) {
        if (this._initialized) {
          this.reload();
        } else {
          this.start();
        }
      } else {
        this.stop();
      }

      this._initialized = true;
    });

    this._options.load();
  }

  public start(): TabRotationStatus {
    console.log("start()");
    let status: TabRotationStatus;
    if (!this._initialized) {
      status = {status: 'waiting', message: 'wating for initialization (config loading)'};
      this._statusChanged.next(status);
      return status;
    }

    if (this._config === undefined) {
      status = {status: 'error', message: 'cannot start tab rotation: config is undefined.'};
      this._statusChanged.next(status);
      return status;
    };
    if (this._session && this._session.isActive) return this.reload();

    this._session = new TabRotateSession(this._config);
    this._session.load().then(() => {
      this._session.start();
      status = {status: 'running'};
      this._statusChanged.next(status);
    });
  }

  public reload(): TabRotationStatus {
    console.log("reload()");
    if (this._config === undefined) {
        return this.stop();
    } else if (!this._session) {
      let status: TabRotationStatus = { status: 'error', message: 'tab rotation not running - cannot reload' };
      this._statusChanged.next(status);
      return status;
    }

    this.stop();
    this.start();
  }

  public stop(): TabRotationStatus {
    console.log("stop()");
    if (this._session) this._session.stop();
    this._session = undefined;

    let status: TabRotationStatus = { status: 'stopped' };
    this._statusChanged.next(status);

    return status;
  }

  public pause(): TabRotationStatus {
    console.log("pause()");
    if (this._session) {
      this._session.pause();
      let status: TabRotationStatus = { status: 'paused' };
      this._statusChanged.next(status);
      return status;
    }

    let status: TabRotationStatus = { status: 'error', message: 'Tab rotation not running - cannot pause' };
    this._statusChanged.next(status);

    return status;
  }

  public resume(): TabRotationStatus {
    console.log("resume()");
    if (!this._session) {

      let status: TabRotationStatus = { status: 'error', message: 'Tab rotation not running - cannot resume' };
      this._statusChanged.next(status);

      return status;
    } else if (!this._session.paused) {
      let status: TabRotationStatus = { status: 'running' };
      this._statusChanged.next(status);
      return status;
    }
    this._session.start();
  }
}