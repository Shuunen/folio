import { slugify } from 'shuutils'
import { messages } from '../utils/messages'
import type { Translator } from '../utils/types'
import { BgLines } from './bg-lines'
import { Heading } from './heading'
import { Skeleton } from './skeleton'

export function ContactMe({ $t }: { $t: Translator }) {
  return (
    <section id={slugify($t(messages.navigation.contact))}>
      <BgLines />
      <div className="container mx-auto flex flex-col gap-14">
        <div className="text-center">
          <Heading level={2}>{$t(messages.pages.contact.title)}</Heading>
        </div>
        <div className="grid md:grid-cols-2 gap-14 w-2/3 mx-auto">
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      </div>
    </section>
  )
}
