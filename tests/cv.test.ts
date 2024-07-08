import { expect, it } from 'vitest'
import { cleanObject, setIds } from '../data/cv'

it('cleanObject A', () => {
  expect(cleanObject({})).toMatchInlineSnapshot('{}')
})

it('cleanObject B', () => {
  expect(cleanObject({ maKey: 'Hello <br> there !' })).toMatchInlineSnapshot(`
    {
      "maKey": "Hello there !",
    }
  `)
})

it('cleanObject C', () => {
  expect(cleanObject({ wow: ['Damn !', '', 'I <b>love</b> this\n'] })).toMatchSnapshot()
})

it('cleanObject D', () => {
  expect(cleanObject({ level0: { another: { key: '' }, wow: ['Damn !', 12, { hello: 'Que tal <image src="plop.jpg" /> ?' }, 'I <b>love</b> this\n'] } })).toMatchSnapshot()
})

it('setIds A', () => {
  expect(setIds({
    basics: { email: '', label: 'Programmer', name: 'John Doe' },
    education: [],
    interests: [],
    skills: [],
    work: [{
      company: 'ACME Inc.',
      endDate: '',
      highlights: ['Started the company'],
      keywords: [],
      photos: [],
      position: 'President',
      sectors: [],
      startDate: '2013-01-01',
    }],
  })).toMatchSnapshot()
})
