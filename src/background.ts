import { Config } from "./models/config";
import { CONFIG_UPDATED_MESSAGE } from "./models/messages";

export const OPTIONS = new Config();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === CONFIG_UPDATED_MESSAGE) {
        OPTIONS.load();
    }
})

OPTIONS.ConfigLoaded.subscribe(config => {
    console.log(config);
});