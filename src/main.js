// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { library } from '@fortawesome/fontawesome-svg-core'

import { faThermometerHalf, faTimesCircle, faMicrochip, faHandPaper, faTint, faStroopwafel, faFire, faCog } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Icons
library.add(faThermometerHalf)
library.add(faTint)
library.add(faStroopwafel)
library.add(faCog)
library.add(faFire)
library.add(faHandPaper)
library.add(faTimesCircle)
library.add(faMicrochip)

Vue.component('font-awesome-icon', FontAwesomeIcon)

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

// Change me!
axios.defaults.baseURL = 'http://localhost:5000'

Vue.use(BootstrapVue)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
