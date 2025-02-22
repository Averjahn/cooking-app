export default defineNuxtConfig({
  nitro: {
    preset: 'static'
  },
  app: {
    baseURL: '/<REPO_NAME>/', // Укажи название репозитория
  },
  modules: ['@element-plus/nuxt'],
  
  css: [],

  build: {
    transpile: []
  },
  extends: '@nuxt/static',
  compatibilityDate: "2025-01-11"
})