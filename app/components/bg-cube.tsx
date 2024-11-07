import Image from 'next/image'
import background from '../textures/bg-cube.svg'

/**
 * Background cube component, shows animated cube rotating
 * @returns JSX.Element
 */
export function BgCube() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return <Image alt="background" className="absolute left-0 top-0 z-0 size-full animate-spin-zoom object-cover" src={background} />
}
