import { gsap } from 'gsap'
import type { MouseEvent } from 'react'

export function moveMockups(event: MouseEvent<HTMLElement>) {
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
