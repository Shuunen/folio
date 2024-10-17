import { slugify } from 'shuutils'
import { messages } from '../utils/messages'
import type { Translator } from '../utils/types'
import { BgLines } from './bg-lines'
import { Heading } from './heading'
import { Skeleton } from './skeleton'

export function Experiences({ $t }: { $t: Translator }) {
  return (
    <section id={slugify($t(messages.navigation.work))}>
      <BgLines />
      <div className="container mx-auto flex flex-col gap-14">
        <div className="text-center md:text-right">
          <Heading level={2}>{$t(messages.pages.work.title)}</Heading>
        </div>
        <div className="grid md:grid-cols-3 gap-14 w-2/3 md:w-auto mx-auto md:mx-0">
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      </div>
    </section>
  )
}
