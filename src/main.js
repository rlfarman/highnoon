import Vue from 'vue'
import Buefy from 'buefy'
import VueClipboard from 'vue-clipboard2'
import firebase from 'firebase/app'
import moment from 'moment-timezone'
import 'firebase/auth'
import { fireInit } from './fireLogin'
import 'material-design-icons'

import App from './App.vue'
import router from './router'
import store from './store'

import burger from './components/Burger'
import leftBar from './components/LeftBar'

Vue.use(Buefy)
Vue.use(VueClipboard)

Vue.config.productionTip = false

Vue.filter('formatDate', function (value) {
  if (value) return moment(value * 1000).format('MMM D, h:mm a')
})
Vue.filter('formatNewsDate', function (value) {
  if (value) return moment(value * 1000).format('MMM D, YYYY')
})

Vue.component('burger', burger)
Vue.component('leftBar', leftBar)

fireInit()

let app

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
