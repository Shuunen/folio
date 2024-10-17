import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import type { ReactNode } from 'react'
import { cn, tw } from 'shuutils'

const serifFont = DM_Serif_Display({ subsets: ['latin'], weight: '400', display: 'swap' })

const sansFont = DM_Sans({ subsets: ['latin'], display: 'swap' })

const base = cn('first-letter:uppercase')

const themes = {
  1: cn(base, tw('text-7xl'), serifFont.className),
  2: cn(base, tw('text-6xl mb-12'), sansFont.className),
  3: cn(base, tw('text-4xl uppercase font-extralight')),
}

export function Heading({ children, level, id = '' }: { children: ReactNode; id?: string; level: 1 | 2 | 3 }) {
  const HeadingTag = `h${level}` as const
  return (
    <HeadingTag id={id} className={themes[level]}>
      {children}
    </HeadingTag>
  )
}
