const pkg = require('./package');
const bodyParser = require('body-parser');

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: "WD Blog",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: "My cool blog for Web Developers" }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href : "https://fonts.googleapis.com/css?family=Open+Sans"}
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/date-filter.js'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
  ],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          exclude: /(node_modules)/
        })
      }
    }
  },

  env: {
    fbAPIKey: 'AIzaSyAdu4cfcBJPhI64DSgP-x_Vry5_8A8Xlmw'
  },

  serverMiddleware: [
    bodyParser.json(),
    '~/api'
  ]
};
