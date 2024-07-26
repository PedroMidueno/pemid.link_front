// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    port: 9000
  },
  devtools: { enabled: true },
  css: ['@/assets/css/main.css'],
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
  },
  tailwindcss: {
    configPath: '@/tailwind.config.ts',
    cssPath: '@/assets/css/main.css'
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
