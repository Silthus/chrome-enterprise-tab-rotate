import { Config, TabRotationConfig } from './config';
import { CONFIG_UPDATED_MESSAGE } from './messages';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { timer, of } from 'rxjs';
import { TabRotateSession } from './tab-rotate-session';

export type TabRotationStatus = 'started' | 'stopped' | 'error' | 'paused';

export class TabRotator {

  private readonly _options = new Config();
  private _config: TabRotationConfig;
  private _session: TabRotateSession;
  private status: TabRotationStatus = 'stopped';

  constructor() {

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    if (message === CONFIG_UPDATED_MESSAGE) {
        this._options.load();
    }
    });

    this._options.ConfigLoaded.pipe(
      tap(config => console.log(config)),
      switchMap(config =>
        timer(0, +config.reload_interval * 1000).pipe(
          switchMap(() => config.getTabRotationConfig()),
          catchError(error => {
            console.error(error);
            return of(undefined);
          })
        )
      )
    ).subscribe(config => {
      this._config = config;
    });

    this._options.load();
  }

  public start(): TabRotationStatus {
    if (this._config === undefined) return 'error';


  }

  public reload(): TabRotationStatus {
    if (this._config === undefined) {
        return this.stop();
    }


  }

  public stop(): TabRotationStatus {
    return 'stopped';
  }
}