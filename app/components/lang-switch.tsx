import { tw } from 'shuutils'
import type { Lang } from '../utils/types'

const langs: Lang[] = ['en', 'fr']

/**
 * Language switch component
 * @param params the parameters
 * @param params.lang the current language like 'en' or 'fr'
 * @returns JSX.Element
 */
export function LangSwitch({ lang: currentLang }: Readonly<{ lang: Lang }>) {
  /**
   * Get the classes for the language
   * @param lang the language
   * @returns the classes
   */
  function classes(lang: Lang) {
    const list = ['uppercase']
    if (lang === currentLang) list.push('text-accent-500')
    if (lang === 'fr') list.push(tw('ml-4 border-l border-neutral-500 pl-4'))
    return list.join(' ')
  }
  return (
    <div className="app-lang-switch flex items-center text-lg">
      {langs.map(lang => (
        <a className={classes(lang)} href={`/${lang}`} key={lang}>
          {lang}
        </a>
      ))}
    </div>
  )
}
