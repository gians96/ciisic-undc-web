// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@nuxt/image',
    '@pinia/nuxt'
  ],
  image: {
    // Deshabilitar IPX en producción para evitar problemas
    provider: 'none'
  },
  colorMode: {
    classSuffix: ''
  },
  ssr: true,
  runtimeConfig: {
    // Variables privadas del servidor (no expuestas al cliente)
    xApiToken: process.env.X_API_TOKEN || '',
    xApiUrl: process.env.X_API_URL || 'https://api-test.nube-tec.com/api/v1/consultation',
    // Variables públicas (expuestas al cliente)
    public: {
      appName: 'VII CIISIC 2025',
      appVersion: '1.0.0'
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'es'
      },
      title: 'VI CIISIC | UNDC',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Xd' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'images/logo/preloader.png' }
      ]
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    },
    layoutTransition: {
      name: 'layout',
      mode: 'out-in'
    }
  },

})