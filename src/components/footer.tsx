import { formatDate } from 'shuutils'
import project from '../../package.json'

/**
 * Footer component
 * @returns JSX.Element
 */
export function Footer() {
  return (
    <div className="flex h-24 w-full items-center justify-center text-center text-sm font-bold lowercase text-primary-400 opacity-50 dark:bg-primary-700" title="__unique-mark__">
      version {project.version} builded on {formatDate(new Date(), 'MMMM yyyy')}
    </div>
  )
}
