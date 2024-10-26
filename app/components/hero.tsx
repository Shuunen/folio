'use client'

import Image from 'next/image'
import { getTranslator } from 'shuutils'
import Blob01 from '../illustrations/blob-dot-01.svg'
import Blob02 from '../illustrations/blob-dot-02.svg'
import Blob03 from '../illustrations/blob-dot-03.svg'
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
            <span className="inline-flex w-100 ">
              <span className="inline underline decoration-primary-300/30 underline-offset-8 dark:decoration-primary-700/70">
                <span className="text-primary-800 dark:text-primary-100">{$t(messages.general.apps)}</span>
                <span>{$t(messages.general.and)}</span>
                <span className="text-primary-500 dark:text-accent-200">{$t(messages.general.websites)}</span>
                <span>{$t(messages.general.forYou)}</span>
                <span className="-ml-1  pl-1 text-primary-400 dark:text-accent-500">.</span>
              </span>
            </span>
          </Heading>
          <Blob01 alt="blob 01" className="absolute -bottom-24 w-44 text-accent-500 dark:text-accent-200 lg:bottom-8 lg:left-56" />
          <Blob02 alt="blob 02" className="absolute -right-24 top-8 w-44 text-primary-500 dark:text-accent-200 xl:right-56" />
          <Blob03 alt="blob 03" className="absolute -bottom-32 right-0 w-96 text-accent-500 dark:text-primary-200 xl:bottom-36 xl:right-72 " />
          <div className="z-0 col-span-2 -ml-48 -mt-24 flex h-96">
            <Image alt="Tablet mockup" className="-mb-80 h-auto w-96 self-end" id="mockup-tablet" src={mockupTablet} />
            <Image alt="Laptop mockup" className="h-120 w-auto" id="mockup-laptop" src={mockupLaptop} />
            <Image alt="Phone mockup" className="-ml-32 -mt-36 h-80 w-auto" id="mockup-phone" src={mockupPhone} />
          </div>
        </div>
      </div>
    </section>
  )
}
