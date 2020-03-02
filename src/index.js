import webMidiMapper from './webMidiMapper'
import querySelector from '@/utils/querySelector'
import actions from './actions'
import store from '@/store'
import gui from './gui'

// For chrome extension, if script is already injected (in App.vue),
// just bring up selection
if (window.__wmm_enable) {
  window.__wmm_enable()
} else {
  store.autoSave = true

  store.on(
    'add-mapping',
    ({ id, selector, inputId, event, action, value, channel }) => {
      const targetEls = querySelector(selector)
      webMidiMapper
        .map(
          inputId,
          event,
          actions[action.key].create(targetEls, action.args),
          value,
          channel
        )
        .setId(id)
    }
  )

  store.on(
    'update-mapping',
    ({ id, selector, inputId, event, action, value, channel }, old) => {
      if (actions[old.action.key].clear) {
        actions[old.action.key].clear(
          querySelector(old.selector),
          old.action.args
        )
      }

      const targetEls = querySelector(selector)
      webMidiMapper.unmap(id)
      webMidiMapper
        .map(
          inputId,
          event,
          actions[action.key].create(targetEls, action.args),
          value,
          channel
        )
        .setId(id)
    }
  )

  store.on('remove-mapping', ({ id }) => {
    webMidiMapper.unmap(id)
  })
}

webMidiMapper.enable().then(() => {
  gui()
  store.tryRestore()
})
