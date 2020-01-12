import { Subject, Observable, empty, throwError, of, iif } from 'rxjs';
import { map, retryWhen, delay, take, concat } from 'rxjs/operators';
import { clean, getJSON } from '../util';
import { CONFIG_UPDATED_MESSAGE } from './messages';
import { ITabRotationConfig } from './tab-rotation-config';

const DEFAULT_CONFIG = {
  source: 'remote',
  url: 'https://raw.githubusercontent.com/Silthus/chrome-enterprise-tab-rotate/master/docs/config.sample.json',
  retry_count: 6,
  retry_interval: 10,
  reload_interval: 60
}

export class Config {
  ConfigPropertyLoaded: Subject<ConfigProperty> = new Subject<ConfigProperty>();
  ConfigLoaded: Subject<Config> = new Subject<Config>();
  ConfigSaved: Subject<Config> = new Subject<Config>();

  source: ConfigSource = 'remote';
  url: string =
    'https://raw.githubusercontent.com/Silthus/chrome-enterprise-tab-rotate/master/docs/config.sample.json';
  retry_count: number = 6;
  retry_interval: number = 10;
  reload_interval: number = 60;
  config: ITabRotationConfig;

  public getTabRotationConfig(): Observable<ITabRotationConfig> {

    const isLocalConfig = () => this.url === undefined || this.url === null || this.url === '' || this.source === 'local';

    return iif(isLocalConfig,
      of(this.config),
      getJSON(this.url).pipe(
        map<any, ITabRotationConfig>(response => response),
        retryWhen(errors =>
          errors.pipe(
            delay(+this.retry_interval * 1000),
            take(+this.retry_count),
            concat(throwError('Error fetching config from ' + this.url + ' after ' + this.retry_count + ' retries...'))
          )
        )
      )
    );
  }

  public load() {
    this.loadDefaults();
    const localStorage = new Promise((resolve) => chrome.storage.sync.get(items => {
      this.loadConfig(items, 'local');
      resolve();
    }));
    const managedStorage = new Promise((resolve) => chrome.storage.managed.get(items => {
      this.loadConfig(items, 'managed');
      resolve();
    }));
    Promise.all([localStorage, managedStorage]).then(() => this.ConfigLoaded.next(this));
  }

  public update(config: { [key: string]: any }) {
    for (let [key, value] of Object.entries(config)) {
      this[key] = value;
    }
    this.save();
    this.load();
  }

  public save() {
    chrome.storage.sync.set(
      {
        url: this.url,
        retry_count: this.retry_count,
        retry_interval: this.retry_interval,
        reload_interval: this.reload_interval,
        source: this.source,
        config: this.config
      },
      () => {
        this.ConfigSaved.next(this);
        chrome.runtime.sendMessage(CONFIG_UPDATED_MESSAGE);
      }
    );
  }

  private loadDefaults() {
    this.loadConfig(DEFAULT_CONFIG, "default");
  }

  private loadConfig(items: { [key: string]: any }, type: ConfigType) {
    const defaultConfig = new Config();

    clean(items);

    console.log("loaded " + type + " config:");
    console.log(items);

    for (let [key, value] of Object.entries(items)) {
      this.ConfigPropertyLoaded.next({
        key,
        value,
        old_value: this[key],
        type: defaultConfig[key] == value ? 'default' : type
      });
      this[key] = value;
    }
  }
}

export interface ConfigProperty {
  key: string;
  value: string | number;
  old_value: string | number;
  type: ConfigType;
}

export type ConfigType = 'default' | 'local' | 'managed';

export type ConfigSource = 'local' | 'remote';