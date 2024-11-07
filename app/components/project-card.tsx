import type { StaticImageData } from 'next/image'
import Link from 'next/link'
import { Heading } from './heading'
import { ProjectCardImage } from './project-card-image'

/**
 * ProjectCard component, used to display a project preview
 * @param props the properties
 * @param props.color the color/accent of the project, like #3CECA3
 * @param props.image the image that represents the project
 * @param props.subtitle the subtitle of the project
 * @param props.title the title of the project
 * @returns JSX.Element
 */
export function ProjectCard({ color, image, subtitle, title }: Readonly<{ color: string; image: Readonly<StaticImageData>; subtitle: string; title: string }>) {
  return (
    <div className="mb-14 flex flex-col">
      <ProjectCardImage color={color} image={image} title={title} />
      <div className="h-8" />
      <Heading level={4}>
        <Link href="#">{title}</Link>
      </Heading>
      <Heading level={5}>{subtitle}</Heading>
    </div>
  )
}
