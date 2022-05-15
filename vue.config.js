module.exports = {
  devServer: {
    disableHostCheck: true,
  },
  publicPath: process.env.BASE_URL,

  transpileDependencies: ['vuetify'],
  pwa: {
    name: 'HR Sysytem',
    short_name: 'HR Sysytem',
    description: 'Welcome in HR Sysytem',
    appleMobileWebAppCapable: 'yes',
    display: 'standalone',
    start_url: '/?standalone=true',
    themeColor: '#ffffff',
    background_color: '#ffffff',
    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: './src/registerServiceWorker.js',
      // ...other Workbox options...
    },
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
}
