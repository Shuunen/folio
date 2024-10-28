import { DM_Sans as dmSans, DM_Serif_Display as dmSerif } from 'next/font/google'
import type { ReactNode } from 'react'
import { cn, tw } from 'shuutils'

const serifFont = dmSerif({ display: 'swap', subsets: ['latin'], weight: '400' })

const sansFont = dmSans({ display: 'swap', subsets: ['latin'] })

const base = cn('first-letter:uppercase')

const themes = {
  1: cn(base, tw('text-7xl'), serifFont.className),
  2: cn(base, tw('mb-12 text-6xl'), sansFont.className),
  3: cn(base, tw('text-4xl font-extralight uppercase'), sansFont.className),
  4: cn(base, tw('mb-2 text-2xl font-bold'), sansFont.className),
  5: cn(base, tw('text-xl font-light'), sansFont.className),
}

/**
 * Heading component to render h1, h2, or h3.
 * @param params the parameters
 * @param params.children the children nodes
 * @param params.id the id of the heading, nice for hash links
 * @param params.level the level of the heading like 1, 2, or 3.
 * @returns JSX.Element
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/no-magic-numbers
export function Heading({ children, id = '', level }: { children: ReactNode; id?: string; level: 1 | 2 | 3 | 4 | 5 }) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const HeadingTag = `h${level}` as const
  return (
    <HeadingTag className={themes[level]} id={id}>
      {children}
    </HeadingTag>
  )
}
