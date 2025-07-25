import { useCallback, useEffect, useState } from 'react'

export const useScrolled = (scrollThreshold: number = 80) => {
  const [scrolled, setScrolled] = useState(0)

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return {
    scrolled,
    isScrolled: scrolled > scrollThreshold,
    isScrolledToTop: scrolled === 0,
  }
}
