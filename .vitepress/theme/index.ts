// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import layout from './layouts/base.vue'
import './styles.css'

const theme: Theme = {
  // eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/prefer-readonly-parameter-types
  enhanceApp ({ app }) {
    // reference components to let them be used in md
    const components = import.meta.glob('../../components/*.vue', { eager: true }) // eslint-disable-line @typescript-eslint/naming-convention
    for (const [path, definition] of Object.entries(components)) {
      const componentName = path.split('/').pop()?.replace(/\.\w+$/u, '')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion
      if (componentName !== undefined) app.component(componentName, (definition as any).default)
    }
  },
  Layout: layout, // eslint-disable-line @typescript-eslint/naming-convention
}

export default theme
