import { fillTemplate } from 'shuutils'

export type Lang = 'en' | 'fr'

export const defaultLang: Lang = 'en'

// eslint-disable-next-line complexity
export function handlePlural(translated: string, data?: Readonly<Record<string, unknown>>) {
  if (!translated.includes('|')) return fillTemplate(translated, data)
  // biome-ignore lint/complexity/useLiteralKeys: <explanation>
  const count = Number.parseInt(String(data?.['count'] ?? '1'), 10)
  const [a = '', b = '', c = ''] = translated.split(' | ') // eslint-disable-line id-length
  if (c.length > 0 && count > 1) return fillTemplate(c, data)
  if ((c.length > 0 && count === 1) || (b.length > 0 && count > 1)) return fillTemplate(b, data)
  return fillTemplate(a, data)
}

export function $t(lang: Lang, message: Readonly<Record<string, string>> | string, data?: Readonly<Record<string, unknown>>) {
  const translated = typeof message === 'string' ? message : message[lang]
  if (translated === undefined) return `missing translation for message "${JSON.stringify(message)}" and lang "${lang}"`
  return handlePlural(translated, data)
}
