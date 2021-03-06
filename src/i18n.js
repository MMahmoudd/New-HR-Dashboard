import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from 'vuetify/lib/locale/en'
import ar from 'vuetify/lib/locale/ar'

Vue.use(VueI18n)

const messages = {
  en: {
    ...require('@/locales/en.json'),
    $vuetify: en,
    },
  ar: {
    ...require('@/locales/ar.json'),
    $vuetify: ar,
  },
}

export default new VueI18n({
  lang: {
    locales: { ar, en },
    current: 'en',
  },
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages,
})
