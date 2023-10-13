import { flatten } from 'shuutils'
import { ref } from 'vue'
import en from '../locales/en.json'
import fr from '../locales/fr.json'
import { logger } from './logger.utils'

const translations = {
  fr: flatten(fr),
  en: flatten(en),
}

type Lang = keyof typeof translations

export const lang = ref<Lang>('en')

export function $t (key: string): string {
  const translated = translations[lang.value][key]
  if (translated !== undefined) return String(translated)
  logger.warn(`Translation not found for key "${key}"`)
  return key
}

export function switchLang () {
  const updatedLang = lang.value === 'en' ? 'fr' : 'en'
  logger.info('switchLang to', updatedLang)
  lang.value = updatedLang
}
