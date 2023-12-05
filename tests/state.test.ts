import { expect, it } from 'vitest'
import { state } from '../utils/state.utils'

it('state A', () => { expect(state.theme).toBe('light') })
