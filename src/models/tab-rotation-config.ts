export interface ITabRotationConfig {
  autoStart?: boolean;
  fullscreen?: boolean;
  lazyLoadTabs?: boolean;
  websites?: IWebsite[];
}

export const ROTATION_CONFIG_DEFAULTS: ITabRotationConfig = {
  autoStart: false,
  fullscreen: false,
  lazyLoadTabs: true,
  websites: []
}

export class TabRotationConfig {

  private _options: ITabRotationConfig;
  get autoStart() { return this._options.autoStart };
  get fullscreen() { return this._options.fullscreen };
  get lazyLoadTabs() { return this._options.lazyLoadTabs };
  get websites() { return this._options.websites };

  constructor(options?: ITabRotationConfig) {
    this._options = {...ROTATION_CONFIG_DEFAULTS, ...options};
    if (options.websites && options.websites?.length > 0) {
      this._options.websites = options.websites.map(website => new Website(website));
    }
  }
}

export interface IWebsite {
  url: string;
  duration?: number;
  tabReloadIntervalSeconds?: number;
}

export const WEBSITE_DEFAULTS: IWebsite = {
  url: '',
  duration: 10,
  tabReloadIntervalSeconds: 60
}

export class Website {

  private _options: IWebsite;
  get url() { return this._options.url };
  get duration() { return this._options.duration };
  get tabReloadIntervalSeconds() { return this._options.tabReloadIntervalSeconds };

  constructor(options?: IWebsite) {
    this._options = {...WEBSITE_DEFAULTS, ...options};
  }
}