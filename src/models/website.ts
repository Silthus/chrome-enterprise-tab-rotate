export const WEBSITE_DEFAULTS: IWebsite = {
    url: '',
    duration: 10,
    tabReloadIntervalSeconds: 60,
    zoom: 0.0
}

export interface IWebsite {
    url: string;
    duration?: number;
    tabReloadIntervalSeconds?: number;
    zoom?: number;
}

export class Website {
    private _options: IWebsite;
    get url(): string { return this._options.url; }
    get duration(): number { return this._options.duration; }
    get tabReloadIntervalSeconds(): number { return this._options.tabReloadIntervalSeconds; }
    get zoom(): number { return this._options.zoom; }

    constructor(options?: IWebsite) {
        this._options = { ...WEBSITE_DEFAULTS, ...options };
    }
}
