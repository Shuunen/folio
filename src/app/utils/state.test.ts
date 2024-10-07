import { expect, it } from 'vitest'
import { state } from './state'

it('state A', () => {
  expect(state.theme).toBe('light')
})
