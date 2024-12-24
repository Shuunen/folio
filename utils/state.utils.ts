import { createState, isBrowserEnvironment } from 'shuutils'
import { storage } from './storage.utils'

export const { state, watchState } = createState({
  theme: isBrowserEnvironment() && /* c8 ignore next */ globalThis.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
}, storage)
