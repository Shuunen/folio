'use client'

import { useThemeMode } from 'flowbite-react'
import { IoSunny } from 'react-icons/io5'
import { cn } from 'shuutils'

/**
 * Theme switch component
 * @returns JSX.Element
 */
export function ThemeSwitch() {
  const { mode, toggleMode } = useThemeMode()
  return (
    <button className={cn(mode === 'dark' ? '' : 'text-accent-500', 'mx-6')} onClick={toggleMode} suppressHydrationWarning={true} type="button">
      <IoSunny />
    </button>
  )
}
