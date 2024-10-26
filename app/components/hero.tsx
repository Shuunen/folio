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

export function Hero({ lang }: { lang: Lang }) {
  const $t = getTranslator(lang)
  return (
    <section id="hero" onMouseMove={moveMockups}>
      <BgLines />
      <div className="container pt-24 lg:py-72 relative">
        <div className="flex flex-col lg:flex-row gap-14">
          <Heading level={1}>
            <span className="inline-flex w-100 ">
              <span className="inline underline underline-offset-8 dark:decoration-primary-700/70 decoration-primary-300/30">
                <span className="text-primary-800 dark:text-primary-100">{$t(messages.general.apps)}</span>
                <span>{$t(messages.general.and)}</span>
                <span className="text-primary-500 dark:text-accent-200">{$t(messages.general.websites)}</span>
                <span>{$t(messages.general.forYou)}</span>
                <span className="-ml-1  text-primary-400 dark:text-accent-500 pl-1">.</span>
              </span>
            </span>
          </Heading>
          <Blob01 alt="blob 01" className="text-accent-500 dark:text-accent-200 absolute w-44 lg:bottom-8 -bottom-24 lg:left-56" />
          <Blob02 alt="blob 02" className="text-primary-500 dark:text-accent-200 absolute w-44 top-8 xl:right-56 -right-24" />
          <Blob03 alt="blob 03" className="text-accent-500 dark:text-primary-200 absolute w-96 xl:bottom-36 -bottom-32 xl:right-72 right-0 " />
          <div className="h-96 flex col-span-2 -ml-48 -mt-24 z-0">
            <Image src={mockupTablet} alt="Tablet mockup" id="mockup-tablet" className="h-auto w-96 self-end -mb-80" />
            <Image src={mockupLaptop} alt="Laptop mockup" id="mockup-laptop" className="h-120 w-auto" />
            <Image src={mockupPhone} alt="Phone mockup" id="mockup-phone" className="h-80 w-auto -ml-32 -mt-36" />
          </div>
        </div>
      </div>
    </section>
  )
}
