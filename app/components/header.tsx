'use client'

import { Navbar, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react'
import Link from 'next/link'
import { getTranslator, slugify } from 'shuutils'
import { messages } from '../utils/messages'
import { useScrollPosition } from '../utils/scroll.client'
import type { Lang } from '../utils/types'
import { LangSwitch } from './lang-switch'
import { ThemeSwitch } from './theme-switch'

/**
 * Header component.
 * @param params the parameters
 * @param params.lang the language like 'en' or 'fr'
 * @returns JSX.Element
 */
export function Header({ lang }: Readonly<{ lang: Lang }>) {
  const $t = getTranslator(lang)
  const links = [messages.navigation.about, messages.navigation.services, messages.navigation.work, messages.navigation.contact].map(link => ({
    href: `#${slugify($t(link))}`,
    title: $t(link),
  }))
  const isScrolled = useScrollPosition()
  return (
    <Navbar
      className={` w-full text-2xl transition-all duration-300 ease-in-out ${isScrolled ? 'fixed animate-slide-down bg-accent-50 shadow-md dark:bg-accent-900' : 'absolute bg-transparent dark:bg-transparent'}  z-20 py-6`}
      rounded={true}
    >
      <div className="flex items-center">
        <Link className="flex gap-3 whitespace-nowrap text-primary-800 dark:text-accent-100" href="#hero">
          <span className="font-mono font-black">/&gt;</span>
          <span className="font-semibold">{$t(messages.general.humaCode)}</span>
        </Link>
      </div>
      <div className="mt-1 flex md:order-2">
        <ThemeSwitch />
        <LangSwitch lang={lang} />
        <div className="w-4" />
        <NavbarToggle />
      </div>
      <NavbarCollapse className="ml-auto items-center">
        {/* eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types */}
        {links.map(link => (
          <NavbarLink active={link.href === '#about'} className="text-xl first-letter:uppercase" href={link.href} key={link.href}>
            {link.title}
          </NavbarLink>
        ))}
      </NavbarCollapse>
    </Navbar>
  )
}
