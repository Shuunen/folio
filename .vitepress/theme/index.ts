/* eslint-disable total-functions/no-unsafe-readonly-mutable-assignment */
// https://vitepress.dev/guide/custom-theme
import { DarkMode, DEFAULT_ICON_CONFIGS, HamburgerButton, IconProvider } from '@icon-park/vue-next'
import '@icon-park/vue-next/styles/index.css'
import type { Theme } from 'vitepress'
import Layout from './layouts/base.vue'
import './styles.css'

const theme: Theme = {
  Layout, // eslint-disable-line @typescript-eslint/naming-convention
  setup () {
    IconProvider({ ...DEFAULT_ICON_CONFIGS, prefix: 'icon' }) // eslint-disable-line new-cap
  },
  enhanceApp ({ app }) {
    // icon park
    app.component('DarkMode', DarkMode)
    app.component('HamburgerButton', HamburgerButton)
    // auto import all components in the components folder
    const components = import.meta.glob('../../components/*.vue', { eager: true }) // eslint-disable-line @typescript-eslint/naming-convention
    Object.entries(components).forEach(([path, definition]) => {
      const componentName = path.split('/').pop()?.replace(/\.\w+$/u, '')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/consistent-type-assertions
      if (componentName !== undefined) app.component(componentName, (definition as any).default)
    })
  },
}

export default theme
