import { of, Observable } from "rxjs";
import * as jQuery from 'jquery';

export function clean(obj) {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined  || obj[propName] === '') {
      delete obj[propName];
    }
  }
  return obj;
}

export function getJSON(url: string) {
  return Observable.create(observer => {
    var canceled = false;
    if (!canceled) {
      jQuery
        .getJSON(url)
        .done(data => {
          observer.next(data);
          observer.complete();
        })
        .fail(err => observer.error(err));
    }
    return () => (canceled = true);
  });
}