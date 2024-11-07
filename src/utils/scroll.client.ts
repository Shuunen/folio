import { useEffect, useState } from 'react'

/**
 * Utility hook to determine if the user has scrolled past a certain threshold
 * @param threshold the threshold to consider the user has scrolled
 * @returns true if the user has scrolled past the threshold
 */
export const useScrollPosition = (threshold = 200) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    /**
     * Handle the scroll event
     */
    const handleScroll = () => {
      const hasScrolled = window.scrollY > threshold
      setIsScrolled(hasScrolled)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [threshold])

  return isScrolled
}
