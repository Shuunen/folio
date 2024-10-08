import { type Lang, getTranslator } from 'shuutils'
import { logger } from '../utils/logger'
import { messages } from './messages'

export default function Home({ params: { lang } }: { params: { lang: Lang } }) {
  logger.info('Home render with lang:', lang)
  const $t = getTranslator(lang)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-4xl">{$t(messages.general.helloWorld)}</h1>
      <span className={`${lang === 'en' ? 'text-accent-600 -rotate-6' : 'text-purple-600 rotate-6'} text-5xl relative inline-block`}>( ͡° ͜ʖ ͡°)</span>
      <a href={lang === 'en' ? '/fr' : '/en'} className="mt-4 p-2 bg-accent-600 text-white rounded">
        {$t(messages.actions.switchLang)}
      </a>
    </div>
  )
}
