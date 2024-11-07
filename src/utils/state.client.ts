import { createState, storage } from 'shuutils'

storage.prefix = 'folio_'

export const { state, watchState } = createState(
  {
    theme: typeof window !== 'undefined' && /* c8 ignore next */ window.matchMedia('(prefers-color-scheme: dark)').matches ? ('dark' as const) : ('light' as const),
  },
  storage,
)
