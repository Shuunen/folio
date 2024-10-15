import Image from 'next/image'
import portrait from '../images/romain-racamier-lafon.avif'
import { messages } from '../utils/messages'
import type { Translator } from '../utils/types'
import { BgLines } from './bg-lines'
import { Heading } from './heading'

export function Hero({ $t }: { $t: Translator }) {
  return (
    <div className="bg-gradient-to-t from-primary-100 to-accent-100 text-2xl dark:from-primary-800 dark:to-accent-900 relative z-0">
      <BgLines />
      <div className="flex justify-between container md:flex-row md:py-64 py-24 flex-col gap-12">
        <div className="flex flex-col gap-12">
          <h2 className="text-4xl uppercase font-thin">{$t(messages.positions.fullstackDev)}</h2>
          <Heading level={1}>
            <span className="text-primary-500 dark:text-accent-100">{$t(messages.general.firstName)}</span>
            <br />
            <span className="text-primary-700 dark:text-accent-300">{$t(messages.general.lastName)}</span>
          </Heading>
          <p className="border-current border-l pl-5 w-80">{$t(messages.pages.home.description)}</p>
        </div>
        <Image
          src={portrait}
          alt={$t(messages.general.fullName)}
          className="rounded-full bg-gradient-to-tr mx-auto size-full max-w-80 lg:max-w-md dark:from-accent-300 from-primary-300 via-transparent border-primary-400 dark:border-accent-400 aspect-square object-contain border-4 "
        />
      </div>
    </div>
  )
}
