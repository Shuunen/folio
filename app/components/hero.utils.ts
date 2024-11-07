/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable id-length */
import { gsap } from 'gsap'
import type { MouseEvent } from 'react'

/**
 * Move the mockups depending on the mouse position
 * @param event the mouse event
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export function moveMockups(event: MouseEvent<HTMLElement>) {
  gsap.to('#mockup-tablet', {
    duration: 0.2,
    x: -((event.clientX - window.innerWidth / 2) / 10),
    y: -((event.clientY - window.innerHeight / 2) / 10),
  })
  gsap.to('#mockup-laptop', {
    duration: 0.2,
    x: -((event.clientX - window.innerWidth / 2) / 35),
    y: -((event.clientY - window.innerHeight / 2) / 35),
  })
  gsap.to('#mockup-phone', {
    duration: 0.2,
    x: -((event.clientX - window.innerWidth / 2) / 15),
    y: -((event.clientY - window.innerHeight / 2) / 15),
  })
}
