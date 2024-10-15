import type { ReactNode } from 'react'
import { cn } from 'shuutils'
import { serifFont } from '../utils/fonts'

export function Heading({ children, level }: { children: ReactNode; level: 1 | 2 | 3 }) {
  const HeadingTag = `h${level}` as const
  const classes = {
    1: 'text-7xl',
    2: 'text-6xl',
    3: 'text-5xl',
  }

  return <HeadingTag className={cn(classes[level], serifFont.className, 'first-letter:uppercase')}>{children}</HeadingTag>
}
