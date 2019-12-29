import { Config } from './models/config';
import { CONFIG_UPDATED_MESSAGE } from './models/messages';
import {
  switchMap,
  withLatestFrom,
  map,
  tap,
  catchError
} from 'rxjs/operators';
import { interval, timer, of } from 'rxjs';

export const OPTIONS = new Config();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  if (message === CONFIG_UPDATED_MESSAGE) {
    OPTIONS.load();
  }
});

OPTIONS.ConfigLoaded.pipe(
  tap(config => console.log(config)),
  switchMap(config =>
    timer(0, +config.reload_interval * 1000).pipe(
      switchMap(() => config.getTabRotationConfig()),
      catchError(error => {
        console.error(error);
        return of({ error: error });
      })
    )
  )
).subscribe(config => {
  console.log(config);
});

OPTIONS.load();
