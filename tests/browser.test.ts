import { expect, it } from 'vitest'
import { getPage, getPath, isBrowser } from '../utils/browser.utils'

it('getPath A', () => { expect(getPath('')).toMatchInlineSnapshot('""') })
it('getPath B', () => { expect(getPath('/')).toMatchInlineSnapshot('"/"') })
it('getPath C', () => { expect(getPath('/contact', 'en')).toMatchInlineSnapshot('"/en/contact"') })
it('getPath D', () => { expect(getPath('/en/contact', 'en')).toMatchInlineSnapshot('"/en/contact"') })
it('getPath E', () => { expect(getPath('/fr/contact', 'en')).toMatchInlineSnapshot('"/en/contact"') })
it('getPath F', () => { expect(getPath('//contact', 'fr')).toMatchInlineSnapshot('"/fr/contact"') })
it('getPath G', () => { expect(getPath('//us///super/contact', 'us')).toMatchInlineSnapshot('"/us/super/contact"') })

it('isBrowser A', () => { expect(isBrowser).toMatchInlineSnapshot('false') })

it('getPage A', () => { expect(getPage('')).toMatchInlineSnapshot('"index"') })
it('getPage B', () => { expect(getPage('//contact')).toMatchInlineSnapshot('"contact"') })
it('getPage C', () => { expect(getPage('/en/contact')).toMatchInlineSnapshot('"contact"') })
it('getPage D', () => { expect(getPage('/fr/contact/top')).toMatchInlineSnapshot('"contact/top"') })
it('getPage E', () => { expect(getPage('/fr/contact/top.html')).toMatchInlineSnapshot('"contact/top"') })
