import Image from 'next/image'
import { type Lang, getTranslator } from 'shuutils'
import portrait from '../images/romain-racamier-lafon.avif'
import background from '../textures/bg-cube.svg'
import { logger } from '../utils/logger'
import { messages } from './messages'

export default function Home({ params: { lang } }: { params: { lang: Lang } }) {
  logger.info('Home render with lang:', lang)
  const $t = getTranslator(lang)
  return (
    <div className="flex items-center justify-center min-h-screen gap-28 overflow-hidden relative text-2xl">
      <Image src={background} alt="background" className="absolute animate-spin-zoom object-cover  size-full top-0 left-0 z-0" />
      <div className="flex flex-col gap-12 text-start z-10">
        <h2 className="text-4xl uppercase font-thin">{$t(messages.positions.fullstackDev)}</h2>
        <h1 className="text-7xl font-bold font-serif scale-y-110 leading-[1.14]">
          <span className="text-accent-100">{$t(messages.general.firstName)}</span>
          <br />
          <span className="text-accent-300">{$t(messages.general.lastName)}</span>
        </h1>
        <p className="border-l pl-5 w-80">{$t(messages.pages.home.description)}</p>
        <a href={lang === 'en' ? '/fr' : '/en'} className="opacity-30">
          {$t(messages.actions.switchLang)}
        </a>
      </div>
      <Image
        src={portrait}
        alt={$t(messages.general.fullName)}
        className="rounded-full z-10 bg-gradient-to-tr from-accent-400 to-primary-800 max-w-96 border-accent-400 aspect-square object-contain border-4 w-1/2"
      />
    </div>
  )
}
