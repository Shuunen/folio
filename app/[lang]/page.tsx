import { type Lang, getTranslator } from 'shuutils'
import { AboutMe } from '../components/about-me'
import { Hero } from '../components/hero'
import { logger } from '../utils/logger'

export default function Home({ params: { lang } }: { params: { lang: Lang } }) {
  logger.info('Home render with lang:', lang)
  const $t = getTranslator(lang)
  return (
    <div className="flex flex-col">
      <Hero $t={$t} />
      <AboutMe />
    </div>
  )
}
