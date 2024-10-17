import { slugify } from 'shuutils'
import { messages } from '../utils/messages'
import type { Translator } from '../utils/types'
import { AboutMePortrait } from './about-me-portrait'
import { BgLines } from './bg-lines'
import { Heading } from './heading'

export function AboutMe({ $t }: { $t: Translator }) {
  return (
    <section id={slugify($t(messages.navigation.about))}>
      <BgLines />
      <div className="container mx-auto flex flex-col gap-14 mb-14">
        <div className="text-center">
          <Heading level={2}>{$t(messages.pages.about.title)}</Heading>
        </div>
        <div className="grid lg:grid-cols-3 gap-14 items-center">
          <div className="flex flex-col gap-12">
            <Heading level={1} id="home">
              <span className="text-primary-500 dark:text-accent-100">{$t(messages.general.firstName)}</span>
              <br />
              <span className="text-primary-700 dark:text-accent-300">{$t(messages.general.lastName)}</span>
            </Heading>
            <p className="border-current border-l pl-5 w-80">{$t(messages.pages.about.me.description)}</p>
          </div>
          <AboutMePortrait alt={$t(messages.general.fullName)} />
          <div className="flex flex-col gap-12 text-right items-end">
            <Heading level={1} id="home">
              <span className="text-primary-500 dark:text-accent-100">Huma</span>
              <br />
              <span className="text-primary-700 dark:text-accent-300">Code</span>
            </Heading>
            <p className="border-current border-r pr-5 w-80">{$t(messages.pages.about.company.description)}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
