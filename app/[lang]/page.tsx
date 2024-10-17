import { type Lang, getTranslator } from 'shuutils'
import { AboutMe } from '../components/about-me'
import { ContactMe } from '../components/contact-me'
import { Experiences } from '../components/experiences'
import { Hero } from '../components/hero'
import { Services } from '../components/services'
import { logger } from '../utils/logger'

export default function Home({ params: { lang } }: { params: { lang: Lang } }) {
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
