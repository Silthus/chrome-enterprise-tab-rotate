import * as $ from 'jquery';
import { Config } from './models/config';
import { mergeConfig } from './util';

// Saves options to chrome.storage.sync.
function save_options() {
  
  const url = $('#url').val().toString();
  const retry_count = $('#retry_count').val() as number;
  const retry_interval = $('#retry_interval').val() as number;
  const reload_interval = $('#reload_interval').val() as number;
  let config: Config = {
    url, retry_count, retry_interval, reload_interval
  };

  chrome.storage.sync.set({...config}, function() {
    // Update status to let user know options were saved.
    console.log(config);
    var status = $('#status');
    status.text('Options saved.').show();
    setTimeout(function() {
      status.text('').hide();
    }, 1500);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
export function restore_options() {
  let config = new Config();

  // fetch the local/synced storage first
  // and override any settings set by the managed storage
  const localStorage = chrome.storage.sync.get = (items: any) =>
    mergeConfig([config, items]).then(localConfig => {
      console.log(localConfig);
      for (let [key, value] of Object.entries(localConfig)) {
        $('#' + key)
          .val(value)
          .prop('disabled', false);
        $('#' + key + '_managed_val').hide();
        $('#' + key + '_hint').hide();
      }
    });

  const managedStorage = chrome.storage.sync.get = (items: any) =>
    mergeConfig([config, items]).then(managedConfig => {
      for (let [key, value] of Object.entries(managedConfig)) {
        $('#' + key).prop('disabled', true);
        $('#' + key + '_managed_val')
          .text(value)
          .show();
        $('#' + key + '_hint').show();
      }
    });

  Promise.all([localStorage, managedStorage]).then(configs => {
    const finalConfig: Config = Object.assign(config, ...configs);
    console.log(finalConfig);
  });
}

$('#save').click(save_options);
$(restore_options); // document.addEventListener('DOMContentLoaded', restore_options);
