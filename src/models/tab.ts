import { Moment } from 'moment'
import moment = require('moment');
import { IWebsite } from './website';

export class Tab implements IWebsite {
  url: string;
  duration = 10;
  tabReloadIntervalSeconds = 10;
  zoom = 0.0;

  id: number;
  index: number;
  loaded = false;
  activationTime: Moment;
  lastReload: Moment;

  get tabDeactivationTime (): Moment {
    return this.activationTime?.add(this.duration, 'seconds') || moment.utc()
  }

  private _tabCallback = (tab: chrome.tabs.Tab): void => {
    this.id = tab.id
    this.index = tab.index
    this.loaded = tab.url !== ''
    if (this.loaded && tab.active) {
      chrome.tabs.setZoom(this.zoom);
    }
  };

  constructor (
    website: IWebsite
  ) {
    this.url = website.url
    this.duration = website.duration
    this.tabReloadIntervalSeconds = website.tabReloadIntervalSeconds
    this.zoom = website.zoom
  }

  public load (options: { active?: boolean; lazyLoad?: boolean } = { active: false, lazyLoad: true }): Promise<Tab> {
    return new Promise<Tab>((resolve) => {
      if (this.id) {
        chrome.tabs.update(this.id, { url: this.url, active: options.active }, (tab) => {
          this._tabCallback(tab)
          this.lastReload = moment.utc()
          resolve(this)
        })
      } else {
        chrome.tabs.create({ index: this.index, url: options.lazyLoad && !options.active ? null : this.url, active: options.active }, (tab) => {
          this._tabCallback(tab)
          if (!options.lazyLoad || options.active) this.lastReload = moment.utc()
          resolve(this)
        })
      }
    });
  }

  /**
   * returns the tab duration in milliseconds
   */
  public activate (): number {
    if (this.isReloadRequired()) this.load();
    if (this.id === undefined) {
      console.error('Unable to load tab ' + this.url + '. No ID!')
      throw new Error('Unable to load tab ' + this.url + '. No ID!')
    }

    this.activationTime = moment.utc()
    chrome.tabs.update(this.id, { active: true }, tab => this._tabCallback(tab));

    return this.duration * 1000;
  }

  public close (): void {
    chrome.tabs.remove(this.id)
  }

  isReloadRequired (): boolean {
    return !this.loaded ||
      this.lastReload.add(this.tabReloadIntervalSeconds, 'seconds') < moment.utc()
  }
}
