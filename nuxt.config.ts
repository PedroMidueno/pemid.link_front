// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      htmlAttrs: {
        lang: 'es'
      },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { href: 'https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap', rel: 'stylesheet' },
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'canonical', href: 'https://pemid.link/' }
      ],
      title: 'pemidlink | Un acortador de urls simple',
      meta: [
        { name: 'description', content: 'pemidlink es un acortador de urls simple y facil de usar.' },
        { property: 'og:title', content: 'pemidlink | Un acortador de urls simple' },
        { property: 'og:description', content: 'pemidlink es un acortador de urls simple y facil de usar.' },
        { property: 'og:url', content: 'https://pemid.link' },
        { property: 'og:image', content: 'https://pemid.link/img/pemid-link-OG-image.png' },
        { property: 'og:site_name', content: 'pemidlink' },
        { property: 'og:type', content: 'website' }
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
