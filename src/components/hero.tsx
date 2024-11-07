import { getTranslator } from 'shuutils'
import Blob01 from '../illustrations/blob-dot-01.svg?react'
import Blob02 from '../illustrations/blob-dot-02.svg?react'
import Blob03 from '../illustrations/blob-dot-03.svg?react'
import mockupLaptop from '../images/mockup-laptop.avif'
import mockupPhone from '../images/mockup-phone.avif'
import mockupTablet from '../images/mockup-tablet.avif'
import { messages } from '../utils/messages'
import type { Lang } from '../utils/types'
import { BgLines } from './bg-lines'
import { Heading } from './heading'
import { moveMockups } from './hero.utils'

/**
 * Hero component
 * @param params the parameters
 * @param params.lang the language like 'en' or 'fr'
 * @returns JSX.Element
 */
export function Hero({ lang }: Readonly<{ lang: Lang }>) {
  const $t = getTranslator(lang)
  return (
    <section id="hero" onMouseMove={moveMockups}>
      <BgLines />
      <div className="container relative pt-24 lg:py-72">
        <div className="flex flex-col gap-14 lg:flex-row">
          <Heading level={1}>
            <span className="inline-flex w-100">
              <span className="inline underline decoration-primary-300/30 underline-offset-8 dark:decoration-primary-700/70">
                <span className="text-primary-800 dark:text-primary-100">{$t(messages.general.apps)}</span>
                <span>{$t(messages.general.and)}</span>
                <span className="text-primary-500 dark:text-orange-300">{$t(messages.general.websites)}</span>
                <span>{$t(messages.general.forYou)}</span>
                <span className="-ml-1  pl-1 text-primary-400 dark:text-orange-400">.</span>
              </span>
            </span>
          </Heading>
          <Blob01 className="absolute -bottom-24 w-44 text-primary-300 dark:text-accent-200 lg:bottom-8 lg:left-56" title="blob 01" />
          <Blob02 className="absolute -right-24 top-8 w-44 text-primary-300 dark:text-accent-200 xl:right-56" title="blob 02" />
          <Blob03 className="absolute -bottom-32 right-0 w-96 text-accent-500 dark:text-primary-200 xl:bottom-36 xl:right-72 " title="blob 03" />
          <div className="z-0 col-span-2 -ml-48 -mt-24 flex h-96">
            <img alt="Tablet mockup" className="-mb-80 h-fit max-w-md self-end" height={mockupTablet.height} id="mockup-tablet" src={mockupTablet.src} width={mockupTablet.width} />
            <img alt="Laptop mockup" className="h-fit max-w-2xl" height={mockupLaptop.height} id="mockup-laptop" src={mockupLaptop.src} width={mockupLaptop.width} />
            <img alt="Phone mockup" className="-ml-24 -mt-40 h-fit max-w-xs" height={mockupPhone.height} id="mockup-phone" src={mockupPhone.src} width={mockupPhone.width} />
          </div>
        </div>
      </div>
    </section>
  )
}
