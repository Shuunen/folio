import { tw } from 'shuutils'
import type { Lang } from '../utils/types'

const langs: Lang[] = ['en', 'fr']

export function LangSwitch({ lang: currentLang }: { lang: Lang }) {
  function classes(lang: Lang) {
    const list = ['uppercase']
    if (lang === currentLang) list.push('text-accent-500')
    if (lang === 'fr') list.push(tw('ml-4 pl-4 border-l'))
    return list.join(' ')
  }
  return (
    <div className="app-lang-switch flex items-center">
      {langs.map(lang => (
        <a key={lang} className={classes(lang)} href={`/${lang}`}>
          {lang}
        </a>
      ))}
    </div>
  )
}
