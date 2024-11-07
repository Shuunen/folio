import Background from '../textures/bg-cube.svg?react'

/**
 * Background cube component, shows animated cube rotating
 * @returns JSX.Element
 */
export function BgCube() {
  return <Background className="absolute left-0 top-0 z-0 size-full animate-spin-zoom object-cover" title="background" />
}
