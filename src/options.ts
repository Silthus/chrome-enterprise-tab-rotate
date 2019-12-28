import * as $ from 'jquery';
import { Config } from './models/config';
import { clean } from './util';

export const OPTIONS = new Config();

// Saves options to chrome.storage.sync.
function save_options() {
  
  OPTIONS.url = $('#url').val().toString();
  OPTIONS.retry_count = $('#retry_count').val() as number;
  OPTIONS.retry_interval = $('#retry_interval').val() as number;
  OPTIONS.reload_interval = $('#reload_interval').val() as number;  

  chrome.storage.sync.set({ 
    url: OPTIONS.url,
    retry_count: OPTIONS.retry_count,
    retry_interval: OPTIONS.retry_interval,
    reload_interval: OPTIONS.reload_interval
  }, function() {
    // Update status to let user know options were saved.
    console.log(OPTIONS);
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

  OPTIONS.ConfigPropertyLoaded.subscribe(prop => {
    
    $('#' + prop.key).val(prop.value).prop('disabled', prop.type === 'managed');
    $('#' + prop.key + '_managed_val').text(prop.type === 'default' ? 'Default value' : 'Overriden by policy').show();
    if (prop.type === 'local') $('#' + prop.key + '_managed_val').hide();

    console.log("config property loaded: " + prop.key + " => " + prop.value + " [type: " + prop.type + ";old_value: " + prop.old_value + "]");
  });

  OPTIONS.ConfigLoaded.subscribe(config => {
    console.log("config loaded...");
    console.log(config);
  });

  OPTIONS.load();
}

$('#status').hide();
$('#save').click(save_options);
$(restore_options);
