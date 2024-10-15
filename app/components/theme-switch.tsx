'use client'

import { useThemeMode } from 'flowbite-react'
import { IoSunny } from 'react-icons/io5'
import { cn } from 'shuutils'

export function ThemeSwitch() {
  const { mode, toggleMode } = useThemeMode()

  return (
    <button type="button" onClick={toggleMode} className="mx-6">
      <IoSunny className={cn(mode === 'dark' ? '' : 'text-accent-500')} />
    </button>
  )
}
