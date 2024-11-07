import { slugify, tw } from 'shuutils'
import Auchan from '../images/auchan-02-s390.avif'
import Collectif from '../images/collectif-energie-02-s390.avif'
import Enedis from '../images/enedis-01-s390.avif'
import Lyf from '../images/lyf-eu-01-s390.avif'
import OuestFrance from '../images/ouest-france-01-s390.avif'
import WeSave from '../images/wesave-01-s390.avif'
import { messages } from '../utils/messages'
import type { Translator } from '../utils/types'
import { BgLines } from './bg-lines'
import { Heading } from './heading'
import { ProjectCard } from './project-card'

/**
 * Experiences component.
 * @param params the parameters
 * @param params.$t the translator
 * @returns JSX.Element
 */
export function Experiences({ $t }: Readonly<{ $t: Translator }>) {
  const { auchan, collectifEnergie, enedis, lyf, ouestFrance, weSave } = messages.showcase
  return (
    <section id={slugify($t(messages.navigation.work))}>
      <BgLines />
      <div className="container mx-auto flex flex-col gap-14">
        <div className="text-center md:text-right">
          <Heading level={2}>{$t(messages.pages.work.title)}</Heading>
        </div>
        <div className="mx-auto grid w-2/3 gap-14 md:mx-0 md:w-auto md:grid-cols-3">
          <ProjectCard color={tw('border-collectif-energie')} image={Collectif} subtitle={$t(collectifEnergie.subtitle)} title={$t(collectifEnergie.title)} />
          <ProjectCard color={tw('border-we-save')} image={WeSave} subtitle={$t(weSave.subtitle)} title={$t(weSave.title)} />
          <ProjectCard color={tw('border-lyf')} image={Lyf} subtitle={$t(lyf.subtitle)} title={$t(lyf.title)} />
          <ProjectCard color={tw('border-auchan')} image={Auchan} subtitle={$t(auchan.subtitle)} title={$t(auchan.title)} />
          <ProjectCard color={tw('border-enedis')} image={Enedis} subtitle={$t(enedis.subtitle)} title={$t(enedis.title)} />
          <ProjectCard color={tw('border-ouest-france')} image={OuestFrance} subtitle={$t(ouestFrance.subtitle)} title={$t(ouestFrance.title)} />
        </div>
      </div>
    </section>
  )
}
