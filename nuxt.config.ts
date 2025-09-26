// https://nuxt.com/docs/api/configuration/nuxt-config

// Debug: Mostrar variables de entorno disponibles
console.log('🔍 Variables de entorno durante la configuración:')
console.log('API_BASE_URL:', process.env.API_BASE_URL || 'NOT_SET')
console.log('X_API_TOKEN:', process.env.X_API_TOKEN ? '***SET***' : 'NOT_SET')
console.log('X_API_URL:', process.env.X_API_URL || 'NOT_SET')
console.log('NODE_ENV:', process.env.NODE_ENV || 'NOT_SET')

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
    xApiUrl: process.env.X_API_URL || '',
    // Variables públicas (expuestas al cliente)
    public: {
      appName: 'VII CIISIC 2025',
      appVersion: '1.0.0',
      // Usar el backend correcto como fallback si la variable no está disponible
      apiBaseUrl: process.env.API_BASE_URL || 'https://api-ciisic-vii.episundc.pe'
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
  }

})
