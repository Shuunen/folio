import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react'
import { FaCode } from 'react-icons/fa6'
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
    <Navbar rounded={true}>
      <NavbarBrand href="https://flowbite.com/">
        <FaCode className="mr-3 size-9 text-accent-200" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">{$t(messages.general.humaCode)}</span>
      </NavbarBrand>
      <div className="flex md:order-2">
        <ThemeSwitch />
        <LangSwitch lang={lang} />
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        {links.map(link => (
          <NavbarLink key={link.href} active={link.href === '#about'} href={link.href}>
            {$t(link.title)}
          </NavbarLink>
        ))}
      </NavbarCollapse>
    </Navbar>
  )
}
