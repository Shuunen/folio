import { logger } from './utils/logger.utils'

export default function Home() {
  logger.info('Home render...')
  return (
    <h1 className="text-4xl">
      Hello World <span className="text-accent-600 rotate-6 relative inline-block">( ͡° ͜ʖ ͡°)</span>
    </h1>
  )
}
