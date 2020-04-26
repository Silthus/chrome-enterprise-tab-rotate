# Chromium Enterprise Tab Rotate Extension

[![build status](https://img.shields.io/github/workflow/status/silthus/chrome-enterprise-tab-rotate/Build)](https://github.com/Silthus/chrome-enterprise-tab-rotate/actions) [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/phdmnkgnjkbnpmeaodonildfklccgimp)](https://chrome.google.com/webstore/detail/enterprise-tab-rotate/phdmnkgnjkbnpmeaodonildfklccgimp) [![Chrome Web Store](https://img.shields.io/chrome-web-store/users/phdmnkgnjkbnpmeaodonildfklccgimp)](https://chrome.google.com/webstore/detail/enterprise-tab-rotate/phdmnkgnjkbnpmeaodonildfklccgimp) [![CodeFactor](https://www.codefactor.io/repository/github/silthus/chrome-enterprise-tab-rotate/badge)](https://www.codefactor.io/repository/github/silthus/chrome-enterprise-tab-rotate) [![Known Vulnerabilities](https://snyk.io/test/github/Silthus/chrome-enterprise-tab-rotate/badge.svg?targetFile=package.json)](https://snyk.io/test/github/Silthus/chrome-enterprise-tab-rotate?targetFile=package.json) [![License](https://img.shields.io/github/license/silthus/chrome-enterprise-tab-rotate)](https://github.com/Silthus/chrome-enterprise-tab-rotate/blob/master/LICENSE)

**Enterprise Tab Rotate** takes tab rotation on Chromium based browsers to the next level. Enables zero touch deployments and easy centralized configuration through chromium policies.

* Allows **local** and **remote** configs in JSON format.
* Configurable **tab** rotation **duration** and **reload interval**.
* **Dynamic config updates**
* Start/Stop/Pause/Reload context menu for **easy testing**.
* **Zero touch** deployment possible.
* **Auto Start** and **Fullscreen** option.
* Config is fully compatible with KevinSheedys [chrome-tab-rotate](https://github.com/KevinSheedy/chrome-tab-rotate)
* Configurable via **chrome://policy**

[![chrome store](assets/ChromeWebStore_BadgeWBorder_v2_206x58.png)](https://chrome.google.com/webstore/detail/enterprise-tab-rotate/phdmnkgnjkbnpmeaodonildfklccgimp)

## Getting started

### Prerequisites

* [Chromium](https://www.chromium.org/) based browser (e.g. Chrome, Edge, Opera, Brave, ...)

### Installation

You can install the extension directly in your current browser by going to the [Chrome Web Store](https://chrome.google.com/webstore/detail/enterprise-tab-rotate/phdmnkgnjkbnpmeaodonildfklccgimp) and install the `chrome-enterprise-tab-rotate` extension.

Or you can automatically install the extension via Group Policies.

### Configuration

The extension can be configured in many ways. Follow the links for the documentation about each configuration method.

* [Manual (Local) Configuration](docs/local.md)
* [Remote Config](docs/remote.md)
* [Windows Registry](https://michaelreichenbach.de/how-to-configure-google-chrome-extensions-with-windows-gpo/)
* [Windows Group Policies](https://michaelreichenbach.de/how-to-configure-google-chrome-extensions-with-windows-gpo/)
* [Managed ChromeOS](docs/chromeos.md)

Each of these configuration methods requires a valid JSON config in the following format.

```json
{
    "autoStart": false,
    "fullscreen": false,
    "lazyLoadTabs": true,
    "websites": [
        {
            "url": "https://github.com/Silthus/chrome-enterprise-tab-rotate",
            "duration": 10,
            "tabReloadIntervalSeconds": 60,
            "zoom": 1.0
        },
        {
            "url": "https://michaelreichenbach.de/",
            "duration": 10,
            "tabReloadIntervalSeconds": 60,
            "zoom": 0.5
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
| `website.zoom` | `0.0` | Zoom level of the tab. 0 resets the zoom level to the default tab zoom. |

## Credits

* Inspiration for this extension comes from KevinSheedys [chrome-tab-rotate](https://github.com/KevinSheedy/chrome-tab-rotate)
* Huge thanks to [@CorCornelisse](https://github.com/CorCornelisse) for testing and providing the [ChromeOS documentation](docs/chromeos.md)
