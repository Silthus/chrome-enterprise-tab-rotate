/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
chrome.runtime = {
    ...chrome.runtime,
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    getManifest: () => {
        return {
            version: '0.0.1',
            // eslint-disable-next-line @typescript-eslint/camelcase
            manifest_version: 2,
            name: 'test'
        }
    }
}
chrome.tabs = {
    ...chrome.tabs,
    setZoom: (zoomLevel, callback) => {
        if (callback) callback();
    }
}