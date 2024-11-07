import Tilt from 'react-parallax-tilt'
import portrait from '../images/romain-racamier-lafon.avif'

/**
 * About me portrait component, shows my face ^^
 * @param params the parameters
 * @param params.alt the alt text for the image
 * @returns JSX.Element
 */
export function AboutMePortrait({ alt }: Readonly<{ alt: string }>) {
  return (
    <Tilt tiltMaxAngleX={9} tiltMaxAngleY={9}>
      <img
        alt={alt}
        className="mx-auto aspect-square size-full w-full max-w-md rounded-full border-4 border-primary-400 bg-gradient-to-tr from-primary-300 via-transparent object-contain dark:border-accent-400 dark:from-accent-300 "
        height={portrait.height}
        src={portrait.src}
        width={portrait.width}
      />
    </Tilt>
  )
}
