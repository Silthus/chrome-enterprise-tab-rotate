import { Tab } from "../models/tab";
import moment from "moment";

describe('tab model', () => {

    let model: Tab;

    beforeEach(() => {
        model = new Tab({
            url: 'http://localhost.test',
            duration: 10,
            tabReloadIntervalSeconds: 10
        });
    });

    describe('load()', () => {

        test('should call chrome.tabs.create', () => {
            model.load();
            expect(chrome.tabs.create).toHaveBeenCalled();
        });

        test('should call chrome.tabs.update if tab exists', () => {
            model.id = 1;
            model.load();
            expect(chrome.tabs.update).toHaveBeenCalled();
        });

        test('should update reloadTime after update', (done) => {
            model.id = 1;
            model.load().then(() => {
                expect(model.lastReload.unix()).toBeCloseTo(moment.utc().unix());
                done();
            });
        });

        test('lazy loaded tabs do not set lastReload', (done) => {
            model.load({lazyLoad: true}).then(() => {
                expect(model.lastReload).toBeUndefined();
                done();
            });
            expect(chrome.tabs.create).toHaveBeenCalledWith({url: null, active: false, index: undefined}, expect.anything());
        });

        test('should directly load tabs if lazyLoad=false', (done) => {
            model.load({lazyLoad: false}).then(() => {
                expect(model.lastReload).not.toBeUndefined();
                done();
            });
            expect(chrome.tabs.create).toHaveBeenCalledWith({ url: 'http://localhost.test' }, expect.anything());
        });

        test('should set index', (done) => {
            model.index = 5;
            model.load().then(() => {
                expect(model.index).toBe(5);
                done();
            });
        });
    });

    describe('isReloadRequired()', () => {

        test('reload if not loaded', () => {
            expect(model.isReloadRequired()).toBe(true);
        });

        test('no reload after initial load', () => {
            model.loaded = true;
            model.lastReload = moment.utc();
            expect(model.isReloadRequired()).toBe(false);
        });

        test('reload after duration', () => {
            model.loaded = true;
            model.lastReload = moment.utc().subtract(11, 'second');
            expect(model.isReloadRequired()).toBe(true);
        });
    });
});