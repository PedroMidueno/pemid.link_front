import type { Config } from 'tailwindcss'

export default <Partial<Config>> {
  darkMode: 'selector',
  safelist: [],
  theme: {
    extend: {
      colors: {
        customViolet: {
          50: '#faf4ff',
          100: '#f2e6ff',
          200: '#e7d2ff',
          300: '#d4aeff',
          400: '#ba7bff',
          500: '#a049ff',
          600: '#8b25f8',
          700: '#7615db',
          800: '#6517b2',
          900: '#53148f',
          950: '#240046',
    },
      }
    }
  }
}