import { expect, it } from 'vitest'
import { messages } from '../[lang]/messages'
import { $t, defaultLang } from './translate'

it('$t A root non-existing translation key', () => {
  expect($t(defaultLang, 'hello')).toMatchInlineSnapshot('"hello"')
})
it('$t B nested non-existing translation key', () => {
  expect($t(defaultLang, 'general.switch-lang')).toMatchInlineSnapshot('"general.switch-lang"')
})
it('$t C nested non-existing translation key with data', () => {
  expect($t(defaultLang, 'general.switch-lang', { lang: 'en' })).toMatchInlineSnapshot('"general.switch-lang"')
})
it('$t D root existing translation key', () => {
  expect($t(defaultLang, messages.actions.switchLang)).toMatchInlineSnapshot(`"voir la version française"`)
})
it('$t E root existing translation key with data', () => {
  expect($t(defaultLang, messages.general.identifier, { date: 'jour de la baguette' })).toMatchInlineSnapshot(`"version {version} builded on jour de la baguette"`)
})
it('$t F singular / plural : singular', () => {
  expect($t(defaultLang, messages.validation.maxChar, { count: 1, fieldName: 'name' })).toMatchInlineSnapshot(`"Le champ doit contenir un seul caractère"`)
})
it('$t G singular / plural : plural', () => {
  expect($t(defaultLang, messages.validation.maxChar, { count: 12, fieldName: 'name' })).toMatchInlineSnapshot(`"Le champ doit contenir 12 caractères maximum"`)
})
it('$t H none / singular / plural : none', () => {
  expect($t(defaultLang, messages.validation.minChar, { count: 0, fieldName: 'name' })).toMatchInlineSnapshot(`"Le champ doit contenir au moins un caractère"`)
})
it('$t I none / singular / plural : singular', () => {
  expect($t(defaultLang, messages.validation.minChar, { count: 1, fieldName: 'name' })).toMatchInlineSnapshot(`"Le champ doit contenir plus d'un caractère"`)
})
it('$t J none / singular / plural : plural', () => {
  expect($t(defaultLang, messages.validation.minChar, { count: 12, fieldName: 'name' })).toMatchInlineSnapshot(`"Le champ doit contenir au moins 12 caractères"`)
})
it('$t K missing data for pluralization', () => {
  expect($t(defaultLang, messages.validation.minChar)).toMatchInlineSnapshot(`"Le champ doit contenir plus d'un caractère"`)
})
it('$t L missing count in data for pluralization', () => {
  expect($t(defaultLang, messages.validation.minChar, { fieldName: 'name' })).toMatchInlineSnapshot(`"Le champ doit contenir plus d'un caractère"`)
})
it('$t M missing current language', () => {
  expect($t(defaultLang, { es: 'Muy bien' })).toMatchInlineSnapshot(`"missing translation for message "{"es":"Muy bien"}" and lang "en""`)
})
