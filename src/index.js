import AsyncComputed from "vue-async-computed";
import webMidiMapper from "./webMidiMapper";
import Vue from "vue";
import App from "./gui/App.vue";
import querySelector from "@/utils/querySelector";
import actions from "./actions";
import store from "@/store";
import "./scss/main.scss";

// For chrome extension, if script is already injected (in App.vue),
// just bring up selection
if (window.__wmm_enable) {
  window.__wmm_enable();
} else {

  store.autoSave = true;
  {
    // make state reactive for vue
    const tmpVm = new Vue({ data: { state: store.state } });
    store.state = tmpVm.state;
  }

  Vue.use(AsyncComputed);
  Vue.prototype.$store = store;

  store.on(
    "add-mapping",
    ({ id, selector, inputId, event, action, value, channel }) => {
      let targetEls = querySelector(selector);
      webMidiMapper
        .map(
          inputId,
          event,
          actions[action.key].create(targetEls, action.args),
          value,
          channel
        )
        .setId(id);
    }
  );

  store.on(
    "update-mapping",
    ({ id, selector, inputId, event, action, value, channel }) => {
      const targetEls = querySelector(selector);
      webMidiMapper.unmap(id);
      webMidiMapper
        .map(
          inputId,
          event,
          actions[action.key].create(targetEls, action.args),
          value,
          channel
        )
        .setId(id);
    }
  );

  store.on("remove-mapping", ({ id }) => {
    webMidiMapper.unmap(id);
  });

  Vue.config.productionTip = false;

  const container = document.createElement("div");
  document.body.appendChild(container);
  webMidiMapper.enable().then(() => {
    new Vue({
      el: container,
      render: h => h(App)
    });

    store.tryRestore();
  });
}
