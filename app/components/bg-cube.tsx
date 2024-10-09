import Image from 'next/image'
import background from '../textures/bg-cube.svg'

export function BgCube() {
  return <Image src={background} alt="background" className="absolute animate-spin-zoom object-cover size-full top-0 left-0 z-0" />
}
