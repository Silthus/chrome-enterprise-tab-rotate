# ChromeOS Policy Documentation

## Getting Started

This guide provides instructions on howto setup and go about managing the "chrome-enterprise-tab-rotate" extension on managed Chrome OS devices.

### Prerequisites

In order to enroll devices, configure settings and most importantly: 'apply policies to users and devices running Chrome OS', you'll need:

* The "Chrome Enterprise Upgrade" in order to manage standalone devices running Chrome OS from the Google Admin console;
* A perpetual upgrade per device you wish to manage.

### Installation

* Open the [Google Admin console](https://admin.google.com)
* Click on *Devices*

![admin-console](images/chromeos/chromeos.admin-console.png)

* Open *Chrome management* through *Device settings* submenu

![chrome-management](images/chromeos/chromeos.chrome-management.png)

* Open *Apps & extensions*

![apps-extensions](images/chromeos/chromeos.apps-extensions.png)

* Select the *Organisational Units* for which you want to deploy the extension/app
* Select the *login type* of your chrome device **users & browsers** or **Managed Guest Sessions** based on your setup

![login-type](images/chromeos/chromeos.login-type.png)

* Select *add from Chrome Web Store* icon in the bottom right corner

![add-from-chrome-web-store](images/chromeos/chromeos.add-from-chrome-web-store.png)

* Search for the app *chrome-enterprise-tab-rotate*
* Click on the app to configure the *Policy for extensions*
* Copy-Paste your [configuration](chromeos.sample.json) into the field, and save changes.

![policy-for-extension](images/chromeos/chromeos.policy-for-extension.png)

### Configuration

An example of the configuration policy can be found [`here`](chromeos.sample.json).

| Setting | Default | Description |
| ------- | ------- | ----------- |
| `autoStart` | `false` | Automatically start rotating tabs after loading the config. |
| `fullscreen` | `false` | Enter fullscreen mode after starting tab rotate. |
| `lazyLoadTabs` | `true` | Open empty tabs and load the website on the first rotation. |
| `websites` | `[]` | Array of `websites` to rotate. |
| `website.url` | `''` | URL to load. |
| `website.duration` | `10` | How long to display the tab in seconds. |
| `website.tabReloadIntervalSeconds` | `60` | Total time in seconds after which the website is reloaded. |
