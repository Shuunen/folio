import components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vitepress'

const name = 'Romain Racamier-Lafon'
const title = `${name} - Folio`
const description = `${name} - Portfolio - Personal website`
const url = 'https://romain.cloud'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  description,
  head: [
    ['link', { href: url, rel: 'canonical' }],
    ['link', { href: '/icons/r-orange-for-dark-theme.svg', rel: 'icon' }],
    // ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
    ['meta', { content: title, name: 'application-name' }],
    ['meta', { content: 'yes', name: 'mobile-web-app-capable' }],
    ['meta', { content: '#00314f', name: 'theme-color' }],
    ['meta', { content: '__unique-mark__', name: 'unique-mark' }],
    ['meta', { content: description, property: 'og:description' }],
    // ['meta', { property: 'og:image', content: '/icons/icon-192x192.png' }],
    ['meta', { content: title, property: 'og:title' }],
    ['meta', { content: 'website', property: 'og:type' }],
    ['meta', { content: url, property: 'og:url' }],
  ],
  locales: {
    fr: {
      label: 'French',
      lang: 'fr', // optional, will be added  as `lang` attribute on `html` tag
    },
    root: {
      label: 'English',
      lang: 'en',
    },
  },
  srcDir: 'pages',
  title,
  vite: {
    plugins: [
      // @ts-expect-error type issue
      components({
        dirs: ['../components'],
        extensions: ['vue'],
      }),
      {
        enforce: 'post',
        name: 'html-inject-nonce-into-script-tag',
        /**
         * Transform the index.html content
         * @param html - HTML content
         * @returns Transformed HTML content
         */
        transformIndexHtml (html) {
          const regex = /<script(?<rest>.*?)/giu
          const replacement = '<script nonce="shu7782n1"$<rest>'
          return html.replace(regex, replacement)
        },
      },
    ],
    server: {
      port: 8080,
    },
  },
})
