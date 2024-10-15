import { Navbar, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react'
import Link from 'next/link'
import { messages } from '../utils/messages'
import type { Lang, Translator } from '../utils/types'
import { LangSwitch } from './lang-switch'
import { ThemeSwitch } from './theme-switch'

const links = [
  { href: '#about', title: messages.navigation.about },
  { href: '#services', title: messages.navigation.services },
  { href: '#work', title: messages.navigation.work },
  { href: '#contact', title: messages.navigation.contact },
]

export function Header({ $t, lang }: { $t: Translator; lang: Lang }) {
  return (
    <Navbar rounded={true} className="fixed text-2xl w-full bg-transparent dark:bg-transparent py-6 z-20">
      <div className="flex items-center">
        <Link className="flex whitespace-nowrap gap-3 text-primary-500 dark:text-accent-500" href="">
          <span className="font-black font-mono">/&gt;</span>
          <span className="font-semibold">{$t(messages.general.humaCode)}</span>
        </Link>
      </div>
      <div className="flex md:order-2 mt-1">
        <ThemeSwitch />
        <LangSwitch lang={lang} />
        <NavbarToggle />
      </div>
      <NavbarCollapse className="ml-auto items-center">
        {links.map(link => (
          <NavbarLink key={link.href} active={link.href === '#about'} href={link.href} className="text-xl first-letter:uppercase">
            {$t(link.title)}
          </NavbarLink>
        ))}
      </NavbarCollapse>
    </Navbar>
  )
}
