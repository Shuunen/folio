import { getTranslator, slugify } from 'shuutils'
import { messages } from '../utils/messages'
import type { Lang } from '../utils/types'
import { BgLines } from './bg-lines'
import { Heading } from './heading'
import { Skeleton } from './skeleton'

/**
 * Services component.
 * @param params the parameters
 * @param params.lang the language like 'en' or 'fr'
 * @returns JSX.Element
 */
export function Services({ lang }: Readonly<{ lang: Lang }>) {
  const $t = getTranslator(lang)
  return (
    <section id={slugify($t(messages.navigation.services))}>
      <BgLines />
      <div className="container mx-auto flex flex-col gap-14">
        <div className="text-center md:text-start">
          <Heading level={2}>{$t(messages.pages.services.title)}</Heading>
        </div>
        <div className="mx-auto grid w-2/3 gap-14 md:mx-0 md:w-auto md:grid-cols-3">
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
