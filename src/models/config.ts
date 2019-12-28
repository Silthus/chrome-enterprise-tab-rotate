import { Subject } from 'rxjs';
import { clean } from '../util';
import { CONFIG_UPDATED_MESSAGE } from './messages';

export class Config {
  ConfigPropertyLoaded: Subject<ConfigProperty> = new Subject<ConfigProperty>();
  ConfigLoaded: Subject<Config> = new Subject<Config>();
  ConfigSaved: Subject<Config> = new Subject<Config>();

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
