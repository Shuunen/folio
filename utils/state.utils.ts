import { createState } from 'shuutils'
import { storage } from './storage.utils'

export const { state, watchState } = createState({
  theme: typeof window !== 'undefined' && /* c8 ignore next */ window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
}, storage)
