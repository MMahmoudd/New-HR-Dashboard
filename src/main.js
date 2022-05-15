import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import './plugins/base.js'
import vuetify from './plugins/vuetify'
// import './style/font.css'
import VueI18n from 'vue-i18n'
import mixins from './mixins/mixins'
import en from './locales/en.json'
import ar from './locales/ar.json'

Vue.use(VueI18n)

// Ready translated locale messages
const language = {
  en: en,
  ar: ar,
}
let userLang = 'en'
if (localStorage.getItem('userLang')) {
  userLang = localStorage.getItem('userLang')
}

// axios.defaults.baseURL = process.env.APP_URL

const userData = localStorage.getItem('token')
if (userData) {
  // axios.defaults.headers.common['x-access-token'] = 'Bearer ' + userData.token
  axios.defaults.headers.common.Authorization = 'Bearer ' + userData
  axios.defaults.headers['Content-type'] = 'application/json'
  axios.defaults.headers.accept = '*/*'
}
// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: userLang,
  messages: language,
})
// Vue Mixins
Vue.mixin({
  mixins: [mixins],
})
new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
