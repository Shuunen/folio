import type { ReactNode } from 'react'
import { cn, tw } from 'shuutils'

const base = cn('first-letter:uppercase')

const themes = {
  1: cn(base, tw('font-serif text-7xl')),
  2: cn(base, tw('mb-12 font-sans text-6xl')),
  3: cn(base, tw('font-sans text-4xl font-extralight uppercase')),
  4: cn(base, tw('mb-2 font-sans text-2xl font-bold')),
  5: cn(base, tw('font-sans text-xl font-light')),
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
