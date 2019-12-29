import { Website } from './config';
import { Moment } from 'moment';
import moment = require('moment');

export class Tab implements Website {
  url: string;
  duration: number = 10;
  tabReloadIntervalSeconds: number = 10;

  id: number;
  index: number;
  loaded: boolean = false;
  activationTime: Moment;
  lastReload: Moment;

  get tabDeactivationTime(): Moment {
      return this.activationTime.add(this.duration, 'seconds') || moment.utc();
  }

  private _tabCallback = (tab: chrome.tabs.Tab) => {
    this.id = tab.id;
    this.index = tab.index;
    this.loaded = tab.url !== '';
  };

  constructor(
    website: Website,
    options?: { index?: number; active?: boolean; lazyLoad?: boolean }
  ) {
    this.url = website.url;
    this.duration = website.duration;
    this.tabReloadIntervalSeconds = website.tabReloadIntervalSeconds;

    if (options.lazyLoad) {
        chrome.tabs.create({index: options.index}, this._tabCallback);
    } else {
        this.lastReload = moment.utc();
        chrome.tabs.create(
            {
            url: this.url,
            index: options.index,
            active: options.active
            },
            this._tabCallback
        );
    }
  }

  private load() {
    if (this.id) {
        chrome.tabs.update(this.id, { url: this.url }, this._tabCallback);
    } else {
        chrome.tabs.update({ url: this.url }, this._tabCallback);
    }
  }

  /**
   * returns the tab duration in milliseconds
   */
  public activate(): number {
    if (this.isReloadRequired()) this.load();
    if (!this.id) {
        console.error("Unable to load tab " + this.url + ". No ID!");
        return;
    }

    this.activationTime = moment.utc();
    chrome.tabs.update(this.id, {active: true});
    return this.duration * 1000;
  }

  public close() {
    chrome.tabs.remove(this.id);
  }

  isReloadRequired(): boolean {
      return !this.loaded 
        || this.lastReload.add(this.tabReloadIntervalSeconds, 'seconds') > moment.utc();
  }
}
