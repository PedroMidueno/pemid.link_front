// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/eslint', '@pinia/nuxt'],
  eslint: {
    config: {
      stylistic: true
    }
  },
  ui: {
    icons: ['mdi']
  },
  colorMode: {
    preference: 'system',
    fallback: 'dark'
  }
})
