'use client'

import { useEffect, useRef, useState } from 'react'

type UseInViewOptions = {
  rootMargin?: string
  threshold?: number | number[]
}

// Latches true on first intersection: once a card has been seen we keep its query enabled, so
// scrolling away (or React Query GC) doesn't tear the chart down and refetch on return. The default
// rootMargin starts the fetch a little before the element is actually on screen.
export const useInView = <T extends Element = HTMLDivElement>({
  rootMargin = '200px',
  threshold = 0,
}: UseInViewOptions = {}) => {
  const ref = useRef<T | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (isInView) {
      return undefined
    }

    const element = ref.current

    if (!element || typeof IntersectionObserver === 'undefined') {
      // SSR / unsupported environment: fail open so the chart still loads.
      setIsInView(true)

      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [isInView, rootMargin, threshold])

  return { ref, isInView }
}
