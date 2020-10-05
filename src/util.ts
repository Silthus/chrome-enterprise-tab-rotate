/* eslint-disable @typescript-eslint/ban-types */
import { Observable } from 'rxjs'
import * as jQuery from 'jquery'
import { TabRotator } from './models/tab-rotate'
import analytics from './analytics'

export function clean (obj: object): object {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
      delete obj[propName]
    }
  }
  return obj
}

export function getJSON (url: string): Observable<object> {
  return Observable.create(observer => {
    let canceled = false
    if (!canceled) {
      jQuery
        .getJSON(url)
        .done(data => {
          observer.next(data)
          observer.complete()
        })
        .fail(err => observer.error(err))
    }
    return (): boolean => (canceled = true)
  })
}

export function configureContextMenu (tabRotator: TabRotator): void {
  chrome.contextMenus.removeAll()
  chrome.contextMenus.create({
    id: 'start_stop',
    title: tabRotator.isStarted ? 'Stop' : 'Start',
    contexts: ['browser_action'],
    onclick: () => {
      if (tabRotator.isStarted) {
        tabRotator.stop()
        analytics.stop()
        chrome.contextMenus.update('start_stop', { title: 'Start' })
      } else {
        tabRotator.start()
        analytics.start()
        chrome.contextMenus.update('start_stop', { title: 'Stop' })
      }
    }
  })
  chrome.contextMenus.create({
    id: 'pause_resume',
    title: 'Pause',
    contexts: ['browser_action'],
    onclick: () => {
      if (tabRotator.isPaused) {
        tabRotator.resume()
        analytics.resume()
        chrome.contextMenus.update('pause_resume', { title: 'Pause' })
      } else {
        tabRotator.pause()
        analytics.pause()
        chrome.contextMenus.update('pause_resume', { title: 'Resume' })
      }
    }
  })
  chrome.contextMenus.create({
    title: 'Reload',
    contexts: ['browser_action'],
    onclick: () => {
      tabRotator.reload()
      analytics.reload()
    }
  })
}