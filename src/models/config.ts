import { Subject, Observable, empty, throwError } from 'rxjs';
import { map, retryWhen, delay, take, concat } from 'rxjs/operators';
import { clean, getJSON } from '../util';
import { CONFIG_UPDATED_MESSAGE } from './messages';
import { TabRotationConfig } from './tab-rotation-config';

export class Config {
  ConfigPropertyLoaded: Subject<ConfigProperty> = new Subject<ConfigProperty>();
  ConfigLoaded: Subject<Config> = new Subject<Config>();
  ConfigSaved: Subject<Config> = new Subject<Config>();

  url: string =
    'https://raw.githubusercontent.com/Silthus/chrome-enterprise-tab-rotate/master/docs/config.sample.json';
  retry_count: number = 6;
  retry_interval: number = 10;
  reload_interval: number = 60;

  public getTabRotationConfig(): Observable<TabRotationConfig> {
    if (this.url === undefined || this.url === null || this.url === '') {
      return empty();
    }
    return getJSON(this.url).pipe(
      map<any, TabRotationConfig>(response => response),
      retryWhen(errors =>
        errors.pipe(
          delay(+this.retry_interval * 1000),
          take(+this.retry_count),
          concat(throwError('Error fetching config from ' + this.url + ' after ' + this.retry_count + ' retries...'))
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
    const managedStorage = new Promise((resolve) => chrome.storage.sync.get(items => {
      this.loadConfig(items, 'managed');
      resolve();
    }));
    Promise.all([localStorage, managedStorage]).then(() => this.ConfigLoaded.next(this));
  }

  public update(config: { [key: string]: any }) {
    for(let [key, value] of Object.entries(config)) {
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
        reload_interval: this.reload_interval
      },
      () => {
        this.ConfigSaved.next(this);
        chrome.runtime.sendMessage(CONFIG_UPDATED_MESSAGE);
      }
    );
  }

  private loadDefaults() {
    this.loadConfig(this, "default");
  }

  private loadConfig(items: { [key: string]: any }, type: ConfigType) {
    const defaultConfig = new Config();

    clean(items);

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
