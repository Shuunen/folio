'use client'

import Image from 'next/image'
import Tilt from 'react-parallax-tilt'
import portrait from '../images/romain-racamier-lafon.avif'

export function AboutMePortrait({ alt }: { alt: string }) {
  return (
    <Tilt tiltMaxAngleX={9} tiltMaxAngleY={9}>
      <Image
        src={portrait}
        alt={alt}
        className="rounded-full max-w-md bg-gradient-to-tr mx-auto size-full w-full dark:from-accent-300 from-primary-300 via-transparent border-primary-400 dark:border-accent-400 aspect-square object-contain border-4 "
      />
    </Tilt>
  )
}
