import { ThemeModeScript } from 'flowbite-react'
import { DM_Sans } from 'next/font/google'
import type { ReactNode } from 'react'
import { type Lang, cn } from 'shuutils'
import { BgLines } from '../components/bg-lines'
import { Footer } from '../components/footer'
import { Header } from '../components/header'
import './globals.css'

const sansFont = DM_Sans({ subsets: ['latin'], display: 'swap' }) // don't know why latin won't load

export default function RootLayout({ children, params: { lang } }: Readonly<{ children: ReactNode; params: { lang: Lang } }>) {
  return (
    <html lang={lang} suppressHydrationWarning={true}>
      <head>
        <ThemeModeScript mode="auto" />
      </head>
      <body className={cn(sansFont.className, 'h-full relative antialiased text-2xl text-primary-800 dark:text-primary-100 bg-primary-100 dark:bg-primary-900 flex flex-col')}>
        <Header lang={lang} />
        <BgLines />
        {children}
        <Footer />
      </body>
    </html>
  )
}
