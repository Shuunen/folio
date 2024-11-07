import { getTranslator, slugify } from 'shuutils'
import { messages } from '../utils/messages'
import type { Lang } from '../utils/types'
import { AboutMePortrait } from './about-me-portrait'
import { BgLines } from './bg-lines'
import { Heading } from './heading'

/**
 * About me component.
 * @param params the parameters
 * @param params.lang the language like 'en' or 'fr'
 * @returns JSX.Element
 */
export function AboutMe({ lang }: Readonly<{ lang: Lang }>) {
  const $t = getTranslator(lang)
  return (
    <section id={slugify($t(messages.navigation.about))}>
      <BgLines />
      <div className="container mx-auto mb-14 flex flex-col gap-14">
        <div className="text-center">
          <Heading level={2}>{$t(messages.pages.about.title)}</Heading>
        </div>
        <div className="grid items-center gap-14 lg:grid-cols-3">
          <div className="flex flex-col gap-12">
            <Heading id="home" level={1}>
              <span className="text-primary-500 dark:text-accent-100">{$t(messages.general.firstName)}</span>
              <br />
              <span className="text-primary-700 dark:text-accent-300">{$t(messages.general.lastName)}</span>
            </Heading>
            <p className="w-80 border-l border-current pl-5">{$t(messages.pages.about.me.description)}</p>
          </div>
          <AboutMePortrait alt={$t(messages.general.fullName)} />
          <div className="flex flex-col items-end gap-12 text-right">
            <Heading id="home" level={1}>
              <span className="text-primary-500 dark:text-accent-100">Huma</span>
              <br />
              <span className="text-primary-700 dark:text-accent-300">Code</span>
            </Heading>
            <p className="w-80 border-r border-current pr-5">{$t(messages.pages.about.company.description)}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
