'use client'

import { gsap } from 'gsap'
import Image from 'next/image'
import type { MouseEvent } from 'react'
import { getTranslator } from 'shuutils'
import mockupLaptop from '../images/mockup-laptop.avif'
import mockupPhone from '../images/mockup-phone.avif'
import mockupTablet from '../images/mockup-tablet.avif'
import { messages } from '../utils/messages'
import type { Lang } from '../utils/types'
import { BgLines } from './bg-lines'
import { Heading } from './heading'

function moveMockups(event: MouseEvent<HTMLElement>) {
  gsap.to('#mockup-tablet', {
    x: -((event.clientX - window.innerWidth / 2) / 10),
    y: -((event.clientY - window.innerHeight / 2) / 10),
    duration: 0.2,
  })
  gsap.to('#mockup-laptop', {
    x: -((event.clientX - window.innerWidth / 2) / 35),
    y: -((event.clientY - window.innerHeight / 2) / 35),
    duration: 0.2,
  })
  gsap.to('#mockup-phone', {
    x: -((event.clientX - window.innerWidth / 2) / 15),
    y: -((event.clientY - window.innerHeight / 2) / 15),
    duration: 0.2,
  })
}

export function Hero({ lang }: { lang: Lang }) {
  const $t = getTranslator(lang)
  return (
    <section id="hero" onMouseMove={moveMockups}>
      <BgLines />
      <div className="container pt-24 lg:py-72 relative">
        <div className="grid lg:grid-cols-3 gap-14">
          <Heading level={1}>
            <span className="underline underline-offset-8 dark:decoration-primary-700/70 decoration-primary-300/30">{$t(messages.general.hero)}</span>
            <span className="text-primary-400 dark:text-accent-500 ml-1">.</span>
          </Heading>
          <div className="h-96 flex col-span-2 -ml-48 -mt-24">
            <Image src={mockupTablet} alt="Tablet mockup" id="mockup-tablet" className="h-auto w-96 self-end -mb-80" />
            <Image src={mockupLaptop} alt="Laptop mockup" id="mockup-laptop" className="h-120 w-auto" />
            <Image src={mockupPhone} alt="Phone mockup" id="mockup-phone" className="h-80 w-auto -ml-32 -mt-36" />
          </div>
        </div>
      </div>
    </section>
  )
}
