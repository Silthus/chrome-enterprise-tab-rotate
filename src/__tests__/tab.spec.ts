import { Tab } from '../models/tab'
import { chrome } from '@bumble/jest-chrome'
import moment from 'moment'

describe('tab model', () => {
  let model: Tab

  beforeEach(() => {
    model = new Tab({
      url: 'http://localhost.it',
      duration: 10,
      tabReloadIntervalSeconds: 10
    })
  })

  describe('load()', () => {
    it('should call chrome.tabs.create', () => {
      model.load()
      expect(chrome.tabs.create).toHaveBeenCalled()
    })

    it('should call chrome.tabs.update if tab exists', () => {
      model.id = 1
      model.load()
      expect(chrome.tabs.update).toHaveBeenCalled()
    })

    it('should update reloadTime after update', (done) => {
      model.id = 1
      model.load().then(() => {
        expect(model.lastReload.unix()).toBeCloseTo(moment.utc().unix())
        done()
      })
    })

    it('lazy loaded tabs do not set lastReload', (done) => {
      model.load({ lazyLoad: true }).then(() => {
        expect(model.lastReload).toBeUndefined()
        done()
      })
      expect(chrome.tabs.create).toHaveBeenCalledWith({ url: null, active: false, index: undefined }, expect.anything())
    })

    it('should directly load tabs if lazyLoad=false', (done) => {
      model.load({ lazyLoad: false }).then(() => {
        expect(model.lastReload).not.toBeUndefined()
        done()
      })
      expect(chrome.tabs.create).toHaveBeenCalledWith({ url: 'http://localhost.it' }, expect.anything())
    })

    it('should set index', (done) => {
      model.index = 5
      model.load().then(() => {
        expect(model.index).toBe(5)
        done()
      })
    })
  })

  describe('activate()', () => {
    it('calls load() if isReloadRequired()', () => {
      model.id = 1
      model.loaded = false
      jest.spyOn(model, 'load')
      model.activate()
      expect(model.load).toHaveBeenCalled()
    })

    it('throws error if id is undefined', () => {
      model.id = undefined
      expect(() => model.activate()).toThrowError()
    })

    it('sets activation time', () => {
      model.id = 1
      model.activate()
      expect(model.activationTime.unix()).toBeCloseTo(moment.utc().unix())
    })

    it('calls chrome.tabs.update and activates tab', () => {
      model.id = 1
      model.activate()
      expect(chrome.tabs.update).toHaveBeenCalledWith(1, { active: true })
    })
  })

  describe('isReloadRequired()', () => {
    it('reload if not loaded', () => {
      expect(model.isReloadRequired()).toBe(true)
    })

    it('no reload after initial load', () => {
      model.loaded = true
      model.lastReload = moment.utc()
      expect(model.isReloadRequired()).toBe(false)
    })

    it('reload after duration', () => {
      model.loaded = true
      model.lastReload = moment.utc().subtract(11, 'second')
      expect(model.isReloadRequired()).toBe(true)
    })
  })

  describe('tabDeactivationTime', () => {
    it('should return activation time + duration', () => {
      model.activationTime = moment.utc()
      expect(model.tabDeactivationTime.unix()).toBeCloseTo(moment.utc().add(model.duration, 'second').unix())
    })

    it('should return current time if not activated', () => {
      expect(model.tabDeactivationTime.unix()).toBeCloseTo(moment.utc().unix())
    })
  })
})
