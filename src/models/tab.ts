import { IWebsite } from "./tab-rotation-config";
import { Moment } from 'moment';
import moment = require('moment');

export class Tab implements IWebsite {
  url: string;
  duration: number = 10;
  tabReloadIntervalSeconds: number = 10;

  id: number;
  index: number;
  loaded: boolean = false;
  activationTime: Moment;
  lastReload: Moment;

  get tabDeactivationTime(): Moment {
    return this.activationTime?.add(this.duration, 'seconds') || moment.utc();
  }

  private _tabCallback = (tab: chrome.tabs.Tab) => {
    this.id = tab.id;
    this.index = tab.index;
    this.loaded = tab.url !== '';
  };

  constructor(
    website: IWebsite
  ) {
    this.url = website.url;
    this.duration = website.duration;
    this.tabReloadIntervalSeconds = website.tabReloadIntervalSeconds;
  }

  public load(options: { active?: boolean; lazyLoad?: boolean } = { active: false, lazyLoad: true }): Promise<Tab> {
    return new Promise<Tab>((resolve, reject) => {
      if (this.id) {
        chrome.tabs.update(this.id, { url: this.url, active: options.active }, (tab) => {
          this._tabCallback(tab);
          this.lastReload = moment.utc();
          resolve(this);
        });
      } else {
        chrome.tabs.create({ index: this.index, url: options.lazyLoad && !options.active ? null : this.url, active: options.active }, (tab) => {
          this._tabCallback(tab);
          if (!options.lazyLoad || options.active) this.lastReload = moment.utc();
          resolve(this);
        });
      }
    });
  }

  /**
   * returns the tab duration in milliseconds
   */
  public activate(): number {
    if (this.isReloadRequired()) this.load();
    if (this.id === undefined) {
      console.error("Unable to load tab " + this.url + ". No ID!");
      throw new Error("Unable to load tab " + this.url + ". No ID!");
    }

    this.activationTime = moment.utc();
    chrome.tabs.update(this.id, { active: true });
    return this.duration * 1000;
  }

  public close() {
    chrome.tabs.remove(this.id);
  }

  isReloadRequired(): boolean {
    return !this.loaded
      || this.lastReload.add(this.tabReloadIntervalSeconds, 'seconds') < moment.utc();
  }
}
