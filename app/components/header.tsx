import { messages } from '../utils/messages'
import type { Lang, Translator } from '../utils/types'
import { LangSwitch } from './lang-switch'

const links = [
  { href: '#about', title: messages.navigation.about },
  { href: '#services', title: messages.navigation.services },
  { href: '#work', title: messages.navigation.work },
  { href: '#contact', title: messages.navigation.contact },
]

export function Header({ $t, lang }: { $t: Translator; lang: Lang }) {
  return (
    <header className="flex container justify-between mx-auto  w-full items-center text-2xl z-10 sticky h-24">
      <a href="/" className="text-2xl font-bold">
        {$t(messages.general.humaCode)}
      </a>
      <nav className="ml-auto mr-8 hidden lg:flex">
        <ul className="list-decimal flex gap-12 uppercase">
          {links.map(({ href, title }) => (
            <li key={href}>
              <a href={href} className="list-decimal">
                {$t(title)}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <LangSwitch lang={lang} />
    </header>
  )
}
