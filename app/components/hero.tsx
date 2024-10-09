import Image from 'next/image'
import portrait from '../images/romain-racamier-lafon.avif'
import { messages } from '../utils/messages'
import type { Translator } from '../utils/types'

export function Hero({ $t }: { $t: Translator }) {
  return (
    <div className="flex justify-between container mx-auto md:flex-row text-2xl md:py-48 py-24 flex-col gap-12">
      <div className="flex flex-col gap-12">
        <h2 className="text-4xl uppercase font-thin">{$t(messages.positions.fullstackDev)}</h2>
        <h1 className="text-6xl lg:text-7xl font-bold font-serif scale-y-110 leading-[1.14]">
          <span className="text-accent-100">{$t(messages.general.firstName)}</span>
          <br />
          <span className="text-accent-300">{$t(messages.general.lastName)}</span>
        </h1>
        <p className="border-l pl-5 w-80">{$t(messages.pages.home.description)}</p>
      </div>
      <Image
        src={portrait}
        alt={$t(messages.general.fullName)}
        className="rounded-full bg-gradient-to-tr mx-auto size-full max-w-80 lg:max-w-md from-accent-400 border-accent-400 aspect-square object-contain border-4 "
      />
    </div>
  )
}
