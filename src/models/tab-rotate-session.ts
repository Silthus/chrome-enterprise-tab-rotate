import { TabRotationConfig } from "./config";
import { Tab } from "./tab";

export class TabRotateSession {

    private _config: TabRotationConfig;
    private _tabs: Tab[] = [];
    private _activeTabIndex: number = 0;
    private _timer: NodeJS.Timeout;
    private _paused: boolean = false;

    private get nextTabIndex(): number {
        let nextTabIndex = this._activeTabIndex + 1;
        if (nextTabIndex > this._tabs.length - 1) nextTabIndex = 0;
        return nextTabIndex;
    }

    constructor(config: TabRotationConfig) {
        this._config = config;
        this.load();
    }

    private load() {
        this._config.websites.forEach((website, i) => {
            this._tabs[i] = new Tab(website, {
                lazyLoad: this._config.lazyLoadTabs,
                index: i,
                active: i === this._activeTabIndex
            });
        })
    }

    start() {
        if (this._timer) clearTimeout(this._timer);
        if (this._config.websites.length < 1) {
            console.error("Cannot rotate tabs. No websites defined.");
            return;
        }
        if (this._tabs.length < 1) this.load();
        if (this._paused) {
            this._paused = false;
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
        this._paused = true;
    }

    stop() {
        this.pause();
        this._tabs.forEach(tab => tab.close());
        this._tabs = [];
        this._activeTabIndex = 0;
    }

    private rotateTab(scheduleNextRotation?: boolean) {
        const nextTabIndex = this.nextTabIndex;
        const duration = this._tabs[nextTabIndex].activate();
        this._activeTabIndex = nextTabIndex;

        if (scheduleNextRotation) {
            this._timer = setTimeout(() => this.rotateTab(!this._paused), duration);
        }
    }
}