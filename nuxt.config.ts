// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    port: 9000
  },
  runtimeConfig: {
    public: {
      backendUrl: process.env.BACKEND_URL
    }
  },
  devtools: { enabled: true },
  css: ['@/assets/css/main.css'],
  modules: ['@nuxt/ui', '@nuxt/eslint', '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
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
