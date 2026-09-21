// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/eslint',
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
    xApiToken: process.env.NUXT_X_API_TOKEN || process.env.X_API_TOKEN || '',
    xApiUrl: process.env.NUXT_X_API_URL || process.env.X_API_URL || '',
    backendBaseUrl: process.env.NUXT_BACKEND_BASE_URL || process.env.API_BASE_URL || 'http://localhost:3000',
    // Variables públicas (expuestas al cliente)
    public: {
      appName: 'VIII CIISIC 2026',
      appVersion: '1.0.0',
      // Usar el backend correcto como fallback si la variable no está disponible
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'https://api-ciisic-vii.episundc.pe'
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'es'
      },
      title: 'VIII CIISIC 2026 | UNDC',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'VIII Congreso Internacional de Ingeniería de Sistemas e Investigación Científica de la UNDC, del 26 al 30 de octubre de 2026.' }
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
  }

})
