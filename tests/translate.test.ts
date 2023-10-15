import { expect, it } from 'vitest'
import { $t, getLangFromPath, lang, localePath } from '../utils/translate.utils'

it('localePath A', () => { expect(localePath('')).toMatchInlineSnapshot('""') })
it('localePath B', () => { expect(localePath('/')).toMatchInlineSnapshot('"/"') })
it('localePath C', () => { expect(localePath('/contact', 'en')).toMatchInlineSnapshot('"/contact"') })
it('localePath D', () => { expect(localePath('/en/contact', 'en')).toMatchInlineSnapshot('"/contact"') })
it('localePath E', () => { expect(localePath('/fr/contact', 'en')).toMatchInlineSnapshot('"/contact"') })
it('localePath F', () => { expect(localePath('/contact', 'fr')).toMatchInlineSnapshot('"/fr/contact"') })

it('lang A', () => { expect(lang.value).toMatchInlineSnapshot('"en"') })

it('$t A', () => { expect($t('hello')).toMatchInlineSnapshot('"hello"') })
it('$t B', () => { expect($t('general.switch-lang')).toMatchInlineSnapshot('"voir la version française"') })

it('getLangFromPath A', () => { expect(getLangFromPath('')).toMatchInlineSnapshot('"en"') })
it('getLangFromPath B', () => { expect(getLangFromPath('/')).toMatchInlineSnapshot('"en"') })
it('getLangFromPath C', () => { expect(getLangFromPath('/contact')).toMatchInlineSnapshot('"en"') })
it('getLangFromPath D', () => { expect(getLangFromPath('/en/contact')).toMatchInlineSnapshot('"en"') })
it('getLangFromPath E', () => { expect(getLangFromPath('/fr/contact')).toMatchInlineSnapshot('"fr"') })
