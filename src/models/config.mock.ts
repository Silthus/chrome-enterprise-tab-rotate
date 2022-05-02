import { Subject, Observable, of } from 'rxjs'
import { Config, ConfigSource } from './config'
import { ITabRotationConfig } from './tab-rotation-config'

export class MockConfig {
    ConfigLoaded: Subject<Config> = new Subject<Config>();

    source: ConfigSource = 'remote';
    url =
        'https://raw.githubusercontent.com/Silthus/chrome-enterprise-tab-rotate/main/docs/config.sample.json';

    retry_count = 6;
    retry_interval = 10;
    reload_interval = 60;
    config: ITabRotationConfig;

    public getTabRotationConfig (): Observable<ITabRotationConfig> {
      return of(this.config)
    }

    public load (): void {
      this.ConfigLoaded.next(this as unknown as Config)
    }

    public update (config: { [key: string]: ITabRotationConfig }): void {
      this.config = { ...this.config, ...config }
    }
}
