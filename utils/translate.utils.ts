import { flatten } from 'shuutils'
import { ref } from 'vue'
import en from '../locales/en.json'
import fr from '../locales/fr.json'
import { logger } from './logger.utils'

const translations = { fr: flatten(fr), en: flatten(en) }
type Lang = keyof typeof translations
const defaultLang: Lang = 'en'

export const isBrowser = typeof document !== 'undefined'

export function getLangFromPath (path: string) {
  const detected = /^\/(?<lang>en|fr)\//u.exec(path)?.groups?.lang ?? defaultLang
  return detected === 'fr' ? 'fr' : defaultLang
}

export const lang = ref<Lang>(getLangFromPath(/* c8 ignore next */isBrowser ? document.location.pathname : ''))

export function localePath (path: string, targetLang = lang.value) { // example with : /fr/contact & 'en'
  let result = path.replace(/^\/[a-z]{2}\//u, '/') // remove any lang from path : /contact
  if (targetLang !== defaultLang) result = `/${targetLang}/${result}` // add target lang to path : /fr//contact
  return result.replace(/\/{2,}/gu, '/') // remove extra slashes : /fr/contact
}

export function $t (key: string) {
  const translated = translations[lang.value][key]
  if (translated !== undefined) return String(translated)
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
