import $ from 'jquery'
import { IConfigProperty, Config, IConfig } from './models/config'

const OPTIONS = new Config()

function adjustTextarea (h): void {
  h.style.height = '20px'
  h.style.height = (h.scrollHeight) + 'px'
}

function showRemote (): void {
  $('.local').hide()
  $('.remote').show()
  $('#config').unbind('keyup')
}

function showLocal (): void {
  $('.local').show()
  $('.remote').hide()
  $('#config').keyup(el => adjustTextarea(el.target))
}

function updateOptionsGui (prop: IConfigProperty): void {
  if (prop.key === 'config') {
    prop.value = JSON.stringify(prop.value, undefined, 4)
  }

  $('#' + prop.key)
    .val(prop.value)
    .prop('disabled', prop.type === 'managed')
  $('#' + prop.key + '_managed_val')
    .text(prop.type === 'default' ? 'Default value' : 'Overriden by policy')
    .show()
  if (prop.type === 'local') $('#' + prop.key + '_managed_val').hide()
  if (prop.key === 'source' && prop.value === 'local') {
    showLocal()
  } else {
    showRemote()
  }
}

// Saves options to chrome.storage.sync.
function saveOptions (): void {
  const options: IConfig = {
    url: $('#url')
      .val()
      .toString(),
    retryCount: $('#retry_count').val() as number,
    retryInterval: $('#retry_interval').val() as number,
    reloadInterval: $('#reload_interval').val() as number,
    source: $('#source').val() as 'local' | 'remote',
    config: $('#source').val() === 'local' ? JSON.parse($('#config').val().toString()) : null
  }

  console.log('Saving options...')
  console.log(options)

  OPTIONS.update(options)

  OPTIONS.ConfigSaved.subscribe(() => {
    // Update status to let user know options were saved.
    const status = $('#status')
    status.text('Options saved.').show()
    setTimeout(function () {
      status.text('').hide()
    }, 1500)
  })
}

export function restoreOptions (): void {
  OPTIONS.ConfigPropertyLoaded.subscribe(prop => updateOptionsGui(prop))

  OPTIONS.ConfigLoaded.subscribe(config => {
    console.log('config loaded...')
    console.log(config)
    if (config.source === 'local') {
      showLocal()
    } else {
      showRemote()
    }
  })

  OPTIONS.load()
}

$(document).on('change', '#source', () => {
  const value = $('#source').val()
  if (value === 'local') {
    showLocal()
  } else {
    showRemote()
  }
})

$('#status').hide()
$('#save').click(saveOptions)
$(restoreOptions)
adjustTextarea($('#config')[0])
