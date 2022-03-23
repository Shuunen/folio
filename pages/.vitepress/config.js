const name = 'Romain Racamier-Lafon'
const title = `${name} - Folio`
const description = `${name} - Portfolio - Personal website`
const url = 'https://rrl-folio.netlify.app'

/**
 * @type {import('vitepress').UserConfig}
 */
 const config = {
  title,
  description,
  head: [
    ['link', { rel: 'canonical', href: url }],
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/assets/icons/favicon.ico' }],
    ['link', { rel: 'manifest', href: '/assets/manifest.webmanifest' }],
    ['meta', { name: 'application-name', content: title }],
    ['meta', { name: 'mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'theme-color', content: '#00314f' }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:image', content: '/assets/icons/icon-192x192.png' }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: url }],
  ]
}

export default config
