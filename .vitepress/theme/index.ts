// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import Layout from './layouts/base.vue'
import './styles.css'

const theme: Theme = {
  Layout, // eslint-disable-line @typescript-eslint/naming-convention
  enhanceApp ({ app }) {
    // reference components to let them be used in md
    const components = import.meta.glob('../../components/*.vue', { eager: true }) // eslint-disable-line @typescript-eslint/naming-convention
    Object.entries(components).forEach(([path, definition]) => {
      const componentName = path.split('/').pop()?.replace(/\.\w+$/u, '')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/consistent-type-assertions
      if (componentName !== undefined) app.component(componentName, (definition as any).default)
    })
  },
}

export default theme
