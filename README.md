# Chromium Enterprise Tab Rotate Extension

[![build status](https://img.shields.io/github/workflow/status/silthus/chrome-enterprise-tab-rotate/Node%20CI)](https://github.com/Silthus/chrome-enterprise-tab-rotate/actions) [![Coverage Status](https://coveralls.io/repos/github/Silthus/chrome-enterprise-tab-rotate/badge.svg?branch=master)](https://coveralls.io/github/Silthus/chrome-enterprise-tab-rotate?branch=master) [![Known Vulnerabilities](https://snyk.io/test/github/Silthus/chrome-enterprise-tab-rotate/badge.svg?targetFile=package.json)](https://snyk.io/test/github/Silthus/chrome-enterprise-tab-rotate?targetFile=package.json) [![License](https://img.shields.io/github/license/silthus/chrome-enterprise-tab-rotate)](https://github.com/Silthus/chrome-enterprise-tab-rotate/blob/master/LICENSE)

**Enterprise Tab Rotate** takes tab rotation on Chromium based browsers to the next level. Enables zero touch deployments and easy centralized configuration through chromium policies.

* Allows **local** and **remote** configs in JSON format.
* Configurable **tab** rotation **duration** and **reload interval**.
* **Dynamic config updates** by using reload intervals.
* Start/Stop/Pause/Reload context menu for **easy testing**.
* **Auto Start** option.
* Configurable via **chrome://policy**

## Getting started

### Prerequisites

* [Chromium](https://www.chromium.org/) based browser (e.g. Chrome, Edge, Opera, Brave, ...)

### Installation

You can install the extension directly in your current browser by going to the [Chrome Web Store](https://chrome.google.com/webstore/category/extensions) and install the `chrome-enterprise-tab-rotate` extension.

Or you can automatically install the extension via Group Policies.

### Configuration

You can define some basic settings like the config source, reload, retry and failure intervals in the options ui or via `chrome://policy`.

![options](docs/options.png)

The actual website rotation config should look like this. You can find more examples in the [`docs/`](docs/config.sample.json) directory.

```json
{
    "autoStart": false,
    "fullscreen": false,
    "lazyLoadTabs": true,
    "websites": [
        {
            "url": "https://github.com/Silthus/chrome-enterprise-tab-rotate",
            "duration": 10,
            "tabReloadIntervalSeconds": 60
        },
        {
            "url": "https://michaelreichenbach.de/",
            "duration": 10,
            "tabReloadIntervalSeconds": 60
        }
    ]
}
```

| Setting | Default | Description |
| ------- | ------- | ----------- |
| `autoStart` | `false` | Automatically start rotating tabs after loading the config. |
| `fullscreen` | `false` | Enter fullscreen mode after starting tab rotate. |
| `lazyLoadTabs` | `true` | Open empty tabs and load the website on the first rotation. |
| `websites` | `[]` | Array of `websites` to rotate. |
| `website.url` | `''` | URL to load. |
| `website.duration` | `10` | How long to display the tab in seconds. |
| `website.tabReloadIntervalSeconds` | `60` | Total time in seconds after which the website is reloaded. |

