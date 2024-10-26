import { ThemeModeScript } from 'flowbite-react'
import { DM_Sans as dmSans } from 'next/font/google'
import type { ReactNode } from 'react'
import { type Lang, cn } from 'shuutils'
import { BgLines } from '../components/bg-lines'
import { Footer } from '../components/footer'
import { Header } from '../components/header'
import './globals.css'

const sansFont = dmSans({ display: 'swap', subsets: ['latin'] }) // don't know why latin won't load

/**
 * Root layout
 * @param properties the properties
 * @param properties.children the children nodes
 * @param properties.params the parameters
 * @returns JSX.Element
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export default async function RootLayout(properties: { children: ReactNode; params: Promise<{ lang: Lang }> }) {
  const parameters = await properties.params
  const { lang } = parameters
  const { children } = properties
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
