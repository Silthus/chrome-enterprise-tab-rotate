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
import { TabRotator } from './models/tab-rotate';

export const OPTIONS = new Config();

new TabRotator()