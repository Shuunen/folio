import { useEffect, useState } from 'react'

export const useScrollPosition = (threshold = 200) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > threshold
      setIsScrolled(scrolled)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [threshold])

  return isScrolled
}
