import { ThemeModeScript } from 'flowbite-react'
import type { ReactNode } from 'react'
import { type Lang, cn, getTranslator } from 'shuutils'
import { BgLines } from '../components/bg-lines'
import { Footer } from '../components/footer'
import { Header } from '../components/header'
import { sansFont } from '../utils/fonts'
import './globals.css'

export default function RootLayout({ children, params: { lang } }: Readonly<{ children: ReactNode; params: { lang: Lang } }>) {
  const $t = getTranslator(lang)
  return (
    <html lang={lang} suppressHydrationWarning={true}>
      <head>
        <ThemeModeScript mode="auto" />
      </head>
      <body className={cn(sansFont.className, 'h-full relative antialiased text-primary-800 dark:text-primary-100 bg-primary-100 dark:bg-primary-900 flex flex-col')}>
        <Header $t={$t} lang={lang} />
        <BgLines />
        {children}
        <Footer />
      </body>
    </html>
  )
}
