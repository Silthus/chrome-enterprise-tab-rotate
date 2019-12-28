import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { clean } from '../util';

export class Config {
  ConfigPropertyLoaded: Subject<ConfigProperty> = new Subject<ConfigProperty>();
  ConfigLoaded: Subject<Config> = new Subject<Config>();

  url: string =
    'https://raw.githubusercontent.com/Silthus/chrome-enterprise-tab-rotate/master/docs/config.sample.json';
  retry_count: number = 6;
  retry_interval: number = 10;
  reload_interval: number = 60;

  public load() {
    this.loadDefaults();
    chrome.storage.sync.get(items => this.loadConfig(items, 'local'));
    chrome.storage.managed.get(items => this.loadConfig(items, 'managed'));
    this.ConfigLoaded.next(this);
  }

  loadDefaults() {
    for (let [key, value] of Object.entries(this).filter(
      ([key, value]) => typeof value === 'string' || typeof value === 'number'
    )) {
      this.ConfigPropertyLoaded.next({
        key,
        value,
        old_value: value,
        type: 'default'
      });
    }
  }

  loadConfig(items: { [key: string]: any }, type: ConfigType) {
    const defaultConfig = new Config();

    clean(items);

    for (let [key, value] of Object.entries(items)) {
      this.ConfigPropertyLoaded.next({
        key,
        value,
        old_value: this[key],
        type: defaultConfig[key] === value ? 'default' : type
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
