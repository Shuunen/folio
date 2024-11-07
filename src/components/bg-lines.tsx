import './bg-lines.css'

/**
 * Background lines component, shows animated lines
 * @returns JSX.Element
 */
export function BgLines() {
  return (
    <div className="app-bg-lines pointer-events-none absolute inset-0 size-full dark:opacity-60">
      <div className="app-lines relative mx-auto flex size-full">
        <div className="line" />
        <div className="line" />
        <div className="line" />
        <div className="line" />
        <div className="line" />
        <div className="line" />
        <div className="line" />
        <div className="line" />
        <div className="line" />
        <div className="line" />
        <div className="line" />
      </div>
    </div>
  )
}
