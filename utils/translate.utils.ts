/* eslint-disable jsdoc/require-jsdoc */
import { fillTemplate, flatten } from 'shuutils'
import { ref } from 'vue'
import en from '../locales/en.json'
import fr from '../locales/fr.json'
import { getPath, isBrowser } from './browser.utils'
import { logger } from './logger.utils'

const translations = { en: flatten(en), fr: flatten(fr) }
type Lang = keyof typeof translations

export const defaultLang: Lang = 'en'

export function getLangFromPath (path: string) {
  const detected = /^\/(?<lang>en|fr)\//u.exec(path)?.groups?.lang ?? defaultLang
  return detected === 'fr' ? 'fr' : defaultLang
}

export const lang = ref<Lang>(getLangFromPath(/* c8 ignore next */isBrowser ? document.location.pathname : ''))

export function localePath (path: string, targetLang = lang.value) {
  return getPath(path, targetLang === defaultLang ? '' : targetLang)
}


export function $t (key: string, data?: Readonly<Record<string, unknown>>) {
  const translated = translations[lang.value][key]
  if (translated !== undefined) return fillTemplate(String(translated), data)
  if (/* c8 ignore next */isBrowser) logger.warn(`Translation not found for key "${key}"`)
  return key
}

/* c8 ignore next 6 */
export function switchLang () {
  lang.value = lang.value === 'en' ? 'fr' : 'en'
  const updatedPath = localePath(window.location.pathname)
  logger.info('switch lang to', lang.value, ', redirecting to', updatedPath)
  document.location.href = updatedPath
}
