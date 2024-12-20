import { type MutableRefObject, useEffect, useRef, useState } from 'react'

/**
 * Custom hook to track which paragraph (or element) is currently visible in the viewport.
 * It uses the Intersection Observer API to efficiently observe visibility changes
 * and updates the active paragraph index.
 *
 * @param {number} threshold - The percentage of an element's visibility required to consider it visible (default: 0.5).
 * @param {string} rootMargin - Margin around the root element for the observer (default: '-10% 0px -10% 0px').
 * @returns {{
 *   activeParagraph: number | null,  // The index of the currently visible paragraph (null if none are visible).
 *   paragraphRefs: React.MutableRefObject<(HTMLParagraphElement | null)[]>  // Refs to attach to paragraph elements.
 * }}
 *
 * @example on click handler:
 *         onClick={() => {
 *               paragraphRefs.current[idx]?.scrollIntoView({
 *                 behavior: 'smooth',
 *                 block: 'center',
 *               })
 *             }}
 *
 * @example content ref usage:
 *                 ref={(element: HTMLParagraphElement | null) => {
 *                   paragraphRefs.current[index] = element
 *                 }}
 */
export const useVisibleParagraph = (
  threshold: number = 0.5,
  rootMargin: string = '-10% 0px -10% 0px',
): {
  activeParagraph: number | null // The index of the currently visible paragraph (null if none are visible).
  paragraphRefs: MutableRefObject<(HTMLParagraphElement | null)[]> // Refs to attach to paragraph elements.
} => {
  const [activeParagraph, setActiveParagraph] = useState<number | null>(0)
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Disconnect any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Create a new IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting)

        if (visibleEntry) {
          const index = paragraphRefs.current.findIndex((ref) => ref === visibleEntry.target)

          if (index !== -1) {
            setActiveParagraph(index)
          }
        }
      },
      {
        threshold,
        rootMargin,
      },
    )

    // Observe all paragraph elements
    paragraphRefs.current.forEach((ref) => {
      if (ref) {
        observerRef.current?.observe(ref)
      }
    })

    // Initial visibility check
    const checkInitialVisibility = () => {
      // Batch DOM reads
      const rects = paragraphRefs.current.map((ref) => (ref ? ref.getBoundingClientRect() : null))

      // Find first visible paragraph
      const visibleIndex = rects.findIndex(
        (rect) =>
          rect &&
          rect.top >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight),
      )

      if (visibleIndex !== -1) {
        setActiveParagraph(visibleIndex)
      }
    }

    // Use requestAnimationFrame for more reliable timing
    requestAnimationFrame(checkInitialVisibility)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [threshold, rootMargin])

  return { activeParagraph, paragraphRefs }
}
