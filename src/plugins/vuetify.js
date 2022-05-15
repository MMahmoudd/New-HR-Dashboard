import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import i18n from '../i18n'
import '@/sass/overrides.sass'

Vue.use(Vuetify)

export default new Vuetify({
    rtl: true,
    lang: {
      t: (key, ...params) => i18n.t(key, params),
    },
    icons: {
        iconfont: 'mdi' || 'fa4',
      },
    breakpoint: {
        thresholds: {
          xs: 340,
          sm: 540,
          md: 800,
          lg: 1280,
        },
        scrollBarWidth: 24,
      },
      theme: {
        // themes: {
        //   dark: theme,
        //   light: theme,
        // },
      },
})
