/* eslint-disable etc/no-commented-out-code */
import { defineConfig } from 'vitepress'

const name = 'Romain Racamier-Lafon'
const title = `${name} - Folio`
const description = `${name} - Portfolio - Personal website`
const url = 'https://romain.cloud'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title,
  description,
  head: [
    ['link', { rel: 'canonical', href: url }],
    ['link', { rel: 'icon', href: '/icons/r-orange-for-dark-theme.svg' }],
    // ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
    ['meta', { name: 'application-name', content: title }],
    ['meta', { name: 'mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'theme-color', content: '#00314f' }],
    ['meta', { name: 'unique-mark', content: '' }],
    ['meta', { property: 'og:description', content: description }],
    // ['meta', { property: 'og:image', content: '/icons/icon-192x192.png' }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: url }],
  ],
  srcDir: 'pages',
})
