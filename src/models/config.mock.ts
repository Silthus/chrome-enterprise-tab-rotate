import { Subject, Observable, of } from "rxjs";
import { Config, ConfigSource } from "./config";
import { ITabRotationConfig } from "./tab-rotation-config";

export class MockConfig {
    ConfigLoaded: Subject<Config> = new Subject<Config>();

    source: ConfigSource = 'remote';
    url: string =
        'https://raw.githubusercontent.com/Silthus/chrome-enterprise-tab-rotate/master/docs/config.sample.json';
    retry_count: number = 6;
    retry_interval: number = 10;
    reload_interval: number = 60;
    config: ITabRotationConfig;

    public getTabRotationConfig(): Observable<ITabRotationConfig> {
        return of(this.config);
    }

    public load() {
        this.ConfigLoaded.next(this as unknown as Config);
    }

    public update(config: { [key: string]: any }) {}
}