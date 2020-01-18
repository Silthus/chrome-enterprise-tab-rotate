import { Subject, Observable, throwError, of, iif } from 'rxjs'
import { map, retryWhen, delay, take, concat } from 'rxjs/operators'
import { clean, getJSON } from '../util'
import { ITabRotationConfig } from './tab-rotation-config'

const DEFAULT_CONFIG = {
  source: 'remote',
  url: 'https://raw.githubusercontent.com/Silthus/chrome-enterprise-tab-rotate/master/docs/config.sample.json',
  retryCount: 6,
  retryInterval: 10,
  reloadInterval: 60
}

export interface IConfig {
  source: 'remote' | 'local';
  url: string;
  retryCount: number;
  retryInterval: number;
  reloadInterval: number;
  config: ITabRotationConfig;
}

export class Config implements IConfig {
  ConfigPropertyLoaded: Subject<IConfigProperty> = new Subject<IConfigProperty>();
  ConfigLoaded: Subject<Config> = new Subject<Config>();
  ConfigSaved: Subject<Config> = new Subject<Config>();

  source: ConfigSource = 'remote';
  url =
    'https://raw.githubusercontent.com/Silthus/chrome-enterprise-tab-rotate/master/docs/config.sample.json';

  retryCount = 6;
  retryInterval = 10;
  reloadInterval = 60;
  config: ITabRotationConfig;

  public getTabRotationConfig (): Observable<ITabRotationConfig> {
    const isLocalConfig = (): boolean => this.url === undefined || this.url === null || this.url === '' || this.source === 'local'

    return iif(isLocalConfig,
      of(this.config),
      getJSON(this.url).pipe(
        map<unknown, ITabRotationConfig>(response => response),
        retryWhen(errors =>
          errors.pipe(
            delay(+this.retryInterval * 1000),
            take(+this.retryCount),
            concat(throwError('Error fetching config from ' + this.url + ' after ' + this.retryCount + ' retries...'))
          )
        )
      )
    )
  }

  public load (): void {
    this.loadDefaults()
    const localStorage = new Promise((resolve) => chrome.storage.sync.get(items => {
      this.loadConfig(items, 'local')
      resolve()
    }))
    const managedStorage = new Promise((resolve) => chrome.storage.managed.get(items => {
      this.loadConfig(items, 'managed')
      resolve()
    }))
    Promise.all([localStorage, managedStorage]).then(() => this.ConfigLoaded.next(this))
  }

  public update (config: IConfig): void {
    for (const [key, value] of Object.entries(config)) {
      this[key] = value
    }
    this.save()
    this.load()
  }

  public save (): void {
    chrome.storage.sync.set(
      {
        url: this.url,
        retryCount: this.retryCount,
        retryInterval: this.retryInterval,
        reloadInterval: this.reloadInterval,
        source: this.source,
        config: this.config
      },
      () => {
        this.ConfigSaved.next(this)
      }
    )
  }

  private loadDefaults (): void {
    this.loadConfig(DEFAULT_CONFIG, 'default')
  }

  private loadConfig (items: { [key: string]: string | number }, type: ConfigType): void  {
    const defaultConfig = new Config()

    clean(items)

    console.log('loaded ' + type + ' config:')
    console.log(items)

    for (const [key, value] of Object.entries(items)) {
      this.ConfigPropertyLoaded.next({
        key,
        value,
        oldValue: this[key],
        type: defaultConfig[key] == value ? 'default' : type
      })
      this[key] = value
    }
  }
}

export interface IConfigProperty {
  key: string;
  value: string | number;
  oldValue: string | number;
  type: ConfigType;
}

export type ConfigType = 'default' | 'local' | 'managed';

export type ConfigSource = 'local' | 'remote';
