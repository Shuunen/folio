import { ThemeModeScript } from 'flowbite-react'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'
import { type Lang, getTranslator } from 'shuutils'
import { BgLines } from '../components/bg-lines'
import { Footer } from '../components/footer'
import { Header } from '../components/header'
import './globals.css'

const fontSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const fontMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export default function RootLayout({ children, params: { lang } }: Readonly<{ children: ReactNode; params: { lang: Lang } }>) {
  const $t = getTranslator(lang)
  return (
    <html lang={lang} suppressHydrationWarning={true}>
      <head>
        <ThemeModeScript mode="auto" />
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} h-full relative antialiased text-primary-900 dark:text-primary-100 bg-primary-100 dark:bg-primary-900 flex flex-col`}
      >
        <Header $t={$t} lang={lang} />
        <BgLines />
        {children}
        <Footer />
      </body>
    </html>
  )
}
