import { Config } from "./models/config";

export function mergeConfig(configs: Config[]): Promise<Config> {
    return new Promise<Config>(() => {
        return Object.assign({}, ...configs);
    });
}