import { TabRotationConfig } from "./config";
import { Tab } from "./tab";

export class TabRotateSession {

    private _config: TabRotationConfig;
    private _tabs: Tab[] = [];
    private _activeTabIndex: number = 0;
    private _timer: NodeJS.Timeout;
    paused: boolean;

    public get isActive() {
        return !this.paused && this._timer !== undefined;
    }

    private get nextTabIndex(): number {
        let nextTabIndex = this._activeTabIndex + 1;
        if (nextTabIndex > this._tabs.length - 1) nextTabIndex = 0;
        return nextTabIndex;
    }

    constructor(config: TabRotationConfig) {
        this._config = config;
    }

    load(): Promise<Tab[]> {
        const result: Promise<Tab>[] = [];
        this._config.websites.forEach((website, i) => {
            this._tabs[i] = new Tab(website);
            result.push(this._tabs[i].load());
        });
        return Promise.all(result);
    }

    start() {
        if (this._timer) clearTimeout(this._timer);
        if (this._config.websites.length < 1) {
            console.error("Cannot rotate tabs. No websites defined.");
            return;
        }
        if (this._tabs.length < 1) this.load();

        this.setFullscreen(this._config.fullscreen);

        if (this.paused) {
            this.paused = false;
            this.rotateTab(true);
            return;
        }

        this._activeTabIndex = 0;
        this._timer = setTimeout(
          () => this.rotateTab(true),
          this._tabs[this._activeTabIndex].activate()
        );
    }

    pause() {
        clearTimeout(this._timer);
        this.paused = true;
        this.setFullscreen(false);
    }

    stop() {
        this.pause();
        this._tabs.forEach(tab => tab.close());
        this._tabs = [];
        this._activeTabIndex = 0;
        this.setFullscreen(false);
    }

    private rotateTab(scheduleNextRotation?: boolean) {
        console.log("rotating tab: currentIndex: " + this._activeTabIndex + " - nextIndex: " + this.nextTabIndex);
        const nextTabIndex = this.nextTabIndex;
        const duration = this._tabs[nextTabIndex].activate();
        this._activeTabIndex = nextTabIndex;

        if (scheduleNextRotation) {
            this._timer = setTimeout(() => this.rotateTab(!this.paused), duration);
        }
    }

    private setFullscreen(fullscreen?: boolean) {
        chrome.windows.getCurrent({}, window => {
            chrome.windows.update(window.id, { state: fullscreen ? 'fullscreen' : 'maximized' });
        });
    }
}