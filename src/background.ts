import { TabRotator } from './models/tab-rotate';

// will autostart based on json config
const tabRotator = new TabRotator();
configureContextMenu(tabRotator);
// tabRotator.start();

tabRotator.StatusChanged.subscribe(status => {
  configureContextMenu(tabRotator);
})

function configureContextMenu(tabRotator: TabRotator) {
  chrome.contextMenus.removeAll();
  chrome.contextMenus.create({
    id: 'start_stop',
    title: tabRotator.isStarted ? "Stop" : "Start",
    contexts: ["browser_action"],
    onclick: () => {
      if (tabRotator.isStarted) {
        tabRotator.stop();
        chrome.contextMenus.update('start_stop', {title: 'Start'});
      } else {
        tabRotator.start();
        chrome.contextMenus.update('start_stop', {title: 'Stop'});
      }
    }
  });
  chrome.contextMenus.create({
    id: 'pause_resume',
    title: "Pause",
    contexts: ["browser_action"],
    onclick: () => {
      if (tabRotator.isPaused) {
        tabRotator.resume();
        chrome.contextMenus.update('pause_resume', {title: 'Pause'});
      } else {
        tabRotator.pause();
        chrome.contextMenus.update('pause_resume', {title: 'Resume'});
      }
    }
  });
  chrome.contextMenus.create({
    title: "Reload",
    contexts: ["browser_action"],
    onclick: () => tabRotator.reload(),
  });
}