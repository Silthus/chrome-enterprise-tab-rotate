import { Website, IWebsite } from "./website";

export interface ITabRotationConfig {
  autoStart?: boolean;
  fullscreen?: boolean;
  lazyLoadTabs?: boolean;
  websites?: IWebsite[];
}

export const configDefaults = (): ITabRotationConfig => {
  return {
    autoStart: false,
    fullscreen: false,
    lazyLoadTabs: true,
    websites: []
  }
}

export class TabRotationConfig {
  private _options: ITabRotationConfig;
  get autoStart(): boolean { return this._options.autoStart };
  get fullscreen(): boolean { return this._options.fullscreen };
  get lazyLoadTabs(): boolean { return this._options.lazyLoadTabs };
  get websites(): IWebsite[] { return this._options.websites };

  constructor(options?: ITabRotationConfig) {
    this._options = { ...configDefaults(), ...options }
    if (options.websites && options.websites?.length > 0) {
      this._options.websites = options.websites.map(website => new Website(website))
    }
  }
}






