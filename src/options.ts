import $ from 'jquery';
import { ConfigProperty, Config } from './models/config';

const OPTIONS = new Config();

// Saves options to chrome.storage.sync.
function save_options() {

  const options = {
    url: $('#url')
      .val()
      .toString(),
    retry_count: $('#retry_count').val(),
    retry_interval: $('#retry_interval').val(),
    reload_interval: $('#reload_interval').val(),
    source: $('#source').val(),
    config: $('#source').val() === 'local' ? JSON.parse($('#config').val().toString()) : null
  };

  console.log("Saving options...");
  console.log(options);

  OPTIONS.update(options);

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
    if (config.source === 'local') {
      showLocal();
    } else {
      showRemote();
    }
  });

  OPTIONS.load();
}

function update_options_gui(prop: ConfigProperty) {

  if (prop.key === 'config') {
    prop.value = JSON.stringify(prop.value, undefined, 4);
  }

  $('#' + prop.key)
    .val(prop.value)
    .prop('disabled', prop.type === 'managed');
  $('#' + prop.key + '_managed_val')
    .text(prop.type === 'default' ? 'Default value' : 'Overriden by policy')
    .show();
  if (prop.type === 'local') $('#' + prop.key + '_managed_val').hide();
  if (prop.key === 'source' && prop.value === 'local') {
    showLocal();
  } else {
    showRemote();
  }
}

function adjust_textarea(h) {
  h.style.height = "20px";
  h.style.height = (h.scrollHeight) + "px";
}

function showRemote() {
  $('.local').hide();
  $('.remote').show();
  $('#config').unbind('keyup');
}

function showLocal() {
  $('.local').show();
  $('.remote').hide();
  $('#config').keyup(el => adjust_textarea(el.target));
}

$(document).on('change', '#source', () => {
  const value = $('#source').val();
  if (value === 'local') {
    showLocal();
  } else {
    showRemote();
  }
});

$('#status').hide();
$('#save').click(save_options);
$(restore_options);
adjust_textarea($('#config')[0]);