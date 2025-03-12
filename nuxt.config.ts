// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { href: 'https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap', rel: 'stylesheet' },
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ] 
    }
  },
  devServer: {
    port: 9000
  },
  runtimeConfig: {
    public: {
      backendUrl: process.env.BACKEND_URL,
      reCAPTCHAsiteKey: process.env.G_RECAPTCHA_SITE_KEY
    }
  },
  devtools: { enabled: true },
  css: ['@/assets/css/main.css'],
  modules: ['@nuxt/ui', '@nuxt/eslint', '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt', '@nuxt/devtools'],
  eslint: {
    config: {
      stylistic: true
    }
  },
  ui: {
    icons: ['mdi', 'material-symbols', 'devicon']
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
