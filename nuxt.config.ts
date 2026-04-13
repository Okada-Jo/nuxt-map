import tailwindcss from '@tailwindcss/vite';

import './lib/env';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  imports: {
    autoImport: true,
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    'nuxt-csurf',
    'nuxt-maplibre',
    '@nuxtjs/i18n',
  ],
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json', flag: '🇬🇧' },
      { code: 'de', name: 'Deutsch', file: 'de.json', flag: '🇩🇪' },
      { code: 'ja', name: '日本語', file: 'ja.json', flag: '🇯🇵' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'en',
    },
  },
  css: ['@/assets/css/main.css'],
  eslint: {
    config: {
      standalone: false,
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  colorMode: {
    dataValue: 'theme',
  },
});
