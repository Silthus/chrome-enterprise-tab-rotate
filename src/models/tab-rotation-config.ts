export interface TabRotationConfig {
  autoStart: boolean;
  fullscreen: boolean;
  lazyLoadTabs: boolean;
  websites: Website[];
}

export interface Website {
  url: string;
  duration: number;
  tabReloadIntervalSeconds: number;
}
