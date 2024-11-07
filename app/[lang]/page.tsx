import { type Lang, getTranslator } from 'shuutils'
import { AboutMe } from '../components/about-me'
import { ContactMe } from '../components/contact-me'
import { Experiences } from '../components/experiences'
import { Hero } from '../components/hero'
import { Services } from '../components/services'
import { logger } from '../utils/logger'

/**
 * Home page
 * @param properties the properties
 * @param properties.params the parameters
 * @returns JSX.Element
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export default async function Home(properties: { params: Promise<{ lang: Lang }> }) {
  const parameters = await properties.params
  const { lang } = parameters
  logger.info('Home render with lang:', lang)
  const $t = getTranslator(lang)
  return (
    <div className="flex flex-col">
      <Hero lang={lang} />
      <AboutMe $t={$t} />
      <Services $t={$t} />
      <Experiences $t={$t} />
      <ContactMe $t={$t} />
    </div>
  )
}
