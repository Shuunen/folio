import { createState } from 'shuutils'
import { storage } from './storage'

export const { state, watchState } = createState(
  {
    theme: typeof window !== 'undefined' && /* c8 ignore next */ window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : ('light' as 'dark' | 'light'),
  },
  storage,
)
