import { messages } from '../utils/messages'
import type { Translator } from '../utils/types'
import { BgLines } from './bg-lines'
import { Heading } from './heading'
import { Skeleton } from './skeleton'

export function AboutMe({ $t }: { $t: Translator }) {
  return (
    <div className="py-32 bg-gradient-to-b from-primary-100 to-accent-100 dark:from-primary-700 dark:to-primary-900 relative z-0">
      <BgLines />
      <div className="container mx-auto grid md:grid-cols-4 gap-14">
        <Heading level={2}>{$t(messages.pages.about.title)}</Heading>
        <p className="text-lg">{$t(messages.pages.about.description)}</p>
        <Skeleton />
        <Skeleton />
      </div>
    </div>
  )
}
