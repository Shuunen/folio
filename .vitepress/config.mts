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
    ['meta', { content: '', name: 'unique-mark' }],
    ['meta', { content: description, property: 'og:description' }],
    // ['meta', { property: 'og:image', content: '/icons/icon-192x192.png' }],
    ['meta', { content: title, property: 'og:title' }],
    ['meta', { content: 'website', property: 'og:type' }],
    ['meta', { content: url, property: 'og:url' }],
  ],
  srcDir: 'pages',
  title,
})
