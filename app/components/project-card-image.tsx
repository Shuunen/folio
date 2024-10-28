'use client'

import Image, { type StaticImageData } from 'next/image'
import Tilt from 'react-parallax-tilt'
import { cn } from 'shuutils'

/**
 * ProjectCardImage component, used to display a project preview image
 * @param props the properties
 * @param props.color the color/accent of the project, like #3CECA3
 * @param props.image the image that represents the project
 * @param props.title the title of the project
 * @returns JSX.Element
 */
export function ProjectCardImage({ color, image, title }: Readonly<{ color: string; image: Readonly<StaticImageData>; title: string }>) {
  return (
    <Tilt className="relative w-full max-w-[390px]" tiltMaxAngleX={5} tiltMaxAngleY={5}>
      <div className={cn('app-border absolute -left-6 top-6 z-0 size-full border-4 opacity-0 transition-opacity duration-500 ease-in-out hover:opacity-100', color)} />
      <Image alt={title} className="pointer-events-none relative z-10" src={image} />
    </Tilt>
  )
}
