import localFont from 'next/font/local'
import type { ReactNode } from 'react'
import { formatDate } from 'shuutils'
import pkg from '../../../package.json'
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

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontMono.variable} antialiased text-primary-900 dark:text-primary-100 bg-primary-100 dark:bg-primary-900 flex flex-col text-center justify-center align-middle`}
      >
        {children}
        <div className="text-sm font-bold text-primary-400 opacity-50 lowercase absolute bottom-4 w-full text-center" title="__unique-mark__">
          version {pkg.version} builded on {formatDate(new Date(), 'MMMM yyyy')}
        </div>
      </body>
    </html>
  )
}