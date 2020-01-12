# Chrome Enterprise Tab Rotate Extension

[![build status](https://img.shields.io/github/workflow/status/silthus/chrome-enterprise-tab-rotate/Node%20CI)](https://github.com/Silthus/chrome-enterprise-tab-rotate/actions) [![Greenkeeper badge](https://badges.greenkeeper.io/Silthus/chrome-enterprise-tab-rotate.svg)](https://greenkeeper.io/)

Chrome tab rotation for enterprises based on a JSON config and configured by policies.

## Getting started

### Prerequisites

* [node + npm](https://nodejs.org/) (Current Version)

### Project Structure

* src/typescript: TypeScript source files
* src/assets: static files
* dist: Chrome Extension directory
* dist/js: Generated JavaScript files

### Setup

```sh
npm install
```

### Build

```sh
npm run build
```

### Build in watch mode

#### Terminal

```sh
npm run watch
```

#### Visual Studio Code

Run watch mode.

type `Ctrl + Shift + B`

### Load extension to chrome

Load `dist` directory

### Test

`npx jest` or `npm run test`
