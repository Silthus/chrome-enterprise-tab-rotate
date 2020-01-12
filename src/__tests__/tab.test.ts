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