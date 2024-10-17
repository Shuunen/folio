import { formatDate } from 'shuutils'
import pkg from '../../package.json'

export function Footer() {
  return (
    <div className="text-sm h-24 flex items-center justify-center font-bold text-primary-400 dark:bg-primary-700 opacity-50 lowercase w-full text-center" title="__unique-mark__">
      version {pkg.version} builded on {formatDate(new Date(), 'MMMM yyyy')}
    </div>
  )
}
