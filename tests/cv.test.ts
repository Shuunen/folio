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
  expect(cleanObject({ level0: { wow: ['Damn !', 12, { hello: 'Que tal <image src="plop.jpg" /> ?' }, 'I <b>love</b> this\n'], another: { key: '' } } })).toMatchSnapshot()
})

it('setIds A', () => {
  expect(setIds({
    basics: { name: 'John Doe', label: 'Programmer', email: '', summary: 'A summary of John Doe...' },
    education: [],
    work: [{
      company: 'ACME Inc.',
      highlights: ['Started the company'],
      position: 'President',
      startDate: '2013-01-01',
      photos: [],
      keywords: [],
      endDate: '',
    }],
    interests: [],
    skills: [],
  })).toMatchSnapshot()
})
