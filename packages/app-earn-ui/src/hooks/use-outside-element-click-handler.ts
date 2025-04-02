'use client'

'use client'
import { type RefObject, useEffect, useRef } from 'react'

/**
 * Custom hook to detect and handle clicks outside of a specified element.
 *
 * This hook accepts a callback function that is executed whenever a click occurs outside
 * the referenced element. The hook returns a `ref` that should be attached to the element
 * we want to monitor for outside clicks.
 *
 * @param cb - The callback function to execute when a click outside the element occurs.
 *
 * @returns A `ref` to be assigned to the element that should listen for outside clicks.
 *
 * @example
 * const ref = useOutsideElementClickHandler(() => console.log('Clicked outside the element!'));
 *
 * return <div ref={ref}>This element listens for outside clicks.</div>
 */
export function useOutsideElementClickHandler(cb: () => void): RefObject<HTMLDivElement | null> {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(ev: MouseEvent) {
      if (elementRef.current && !elementRef.current.contains(ev.target as Node)) {
        cb()
      }
    }
    document.addEventListener('mousedown', handleClick)

    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [])

  return elementRef
}
