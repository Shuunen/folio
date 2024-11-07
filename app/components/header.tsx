'use client'

import { Navbar, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react'
import Link from 'next/link'
import { getTranslator, slugify } from 'shuutils'
import Logo from '../icons/humacode-logo.svg'
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
      className={` w-full text-2xl transition-all duration-300 ease-in-out ${isScrolled ? 'fixed mt-0 animate-slide-down bg-accent-50 shadow-md dark:bg-primary-900' : 'absolute mt-8 bg-transparent dark:bg-transparent'}  z-20`}
      rounded={true}
    >
      <div className="flex items-center">
        <Link className="flex items-center gap-4 whitespace-nowrap text-primary-900 dark:text-primary-200" href="#hero">
          <Logo className="size-14 text-primary-500 dark:text-primary-200" />
          <div className="flex flex-col">
            <span className="font-bold">{$t(messages.general.humaCode)}</span>
            <span className="text-base">{$t(messages.general.tagLine)}</span>
          </div>
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
          <NavbarLink active={link.href === '#about'} className="text-xl font-semibold first-letter:uppercase" href={link.href} key={link.href}>
            {link.title}
          </NavbarLink>
        ))}
      </NavbarCollapse>
    </Navbar>
  )
}
