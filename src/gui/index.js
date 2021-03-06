import Vue from 'vue'
import App from './App.vue'
import store from '@/store'

Vue.config.productionTip = false

export default function init () {
  const container = document.createElement('div')

  Vue.prototype.$store = store

  document.body.appendChild(container)
  Vue({
    el: container,
    render: h => h(App)
  })
}
