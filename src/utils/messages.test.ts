import { expect, it } from 'vitest'
import { messages } from './messages'

it('message A', () => {
  expect(messages.actions.switchLang).toMatchInlineSnapshot(`
    {
      "en": "voir la version française",
      "fr": "see the english version",
    }
  `)
})
