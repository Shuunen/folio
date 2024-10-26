import { Navbar, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react'
import Link from 'next/link'
import { getTranslator, slugify } from 'shuutils'
import { messages } from '../utils/messages'
import type { Lang } from '../utils/types'
import { LangSwitch } from './lang-switch'
import { ThemeSwitch } from './theme-switch'

export function Header({ lang }: { lang: Lang }) {
  const $t = getTranslator(lang)
  const links = [messages.navigation.about, messages.navigation.services, messages.navigation.work, messages.navigation.contact].map(link => ({
    href: `#${slugify($t(link))}`,
    title: $t(link),
  }))
  return (
    <Navbar rounded={true} className="fixed text-2xl w-full bg-transparent dark:bg-transparent py-6 z-20">
      <div className="flex items-center">
        <Link className="flex whitespace-nowrap gap-3 text-primary-800 dark:text-accent-100" href="#hero">
          <span className="font-black font-mono">/&gt;</span>
          <span className="font-semibold">{$t(messages.general.humaCode)}</span>
        </Link>
      </div>
      <div className="flex md:order-2 mt-1">
        <ThemeSwitch />
        <LangSwitch lang={lang} />
        <div className="w-4" />
        <NavbarToggle />
      </div>
      <NavbarCollapse className="ml-auto items-center">
        {links.map(link => (
          <NavbarLink key={link.href} active={link.href === '#about'} href={link.href} className="text-xl first-letter:uppercase">
            {link.title}
          </NavbarLink>
        ))}
      </NavbarCollapse>
    </Navbar>
  )
}
