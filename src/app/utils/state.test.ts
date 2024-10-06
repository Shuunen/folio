import { expect, it } from 'vitest'
import { state } from './state.utils'

it('state A', () => {
  expect(state.theme).toBe('light')
})
