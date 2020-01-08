import $ from 'jquery';
import 'jquery-ui';
import { ConfigProperty, Config } from './models/config';

const OPTIONS = new Config();

// Saves options to chrome.storage.sync.
function save_options() {

  OPTIONS.update({
    url: $('#url')
      .val()
      .toString(),
    retry_count: $('#retry_count').val(),
    retry_interval: $('#retry_interval').val(),
    reload_interval: $('#reload_interval').val()
  });

  OPTIONS.ConfigSaved.subscribe(() => {
    // Update status to let user know options were saved.
    var status = $('#status');
    status.text('Options saved.').show();
    setTimeout(function() {
      status.text('').hide();
    }, 1500);
  });
}

export function restore_options() {
  OPTIONS.ConfigPropertyLoaded.subscribe(prop => update_options_gui(prop));

  OPTIONS.ConfigLoaded.subscribe(config => {
    console.log('config loaded...');
    console.log(config);
  });

  OPTIONS.load();
}

function update_options_gui(prop: ConfigProperty) {

  $('#' + prop.key)
    .val(prop.value)
    .prop('disabled', prop.type === 'managed');
  $('#' + prop.key + '_managed_val')
    .text(prop.type === 'default' ? 'Default value' : 'Overriden by policy')
    .show();
  if (prop.type === 'local') $('#' + prop.key + '_managed_val').hide();
}

function adjust_textarea(h) {
  h.style.height = "20px";
  h.style.height = (h.scrollHeight) + "px";
}

$('#tabs').tabs();
$('#status').hide();
$('#save').click(save_options);
$(restore_options);