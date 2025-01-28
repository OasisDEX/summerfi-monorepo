'use client'
import { useEffect, useState } from 'react'

/**
 * Hook to detect if the current window is running inside an iframe
 * @returns {boolean} True if running in an iframe, false otherwise
 */
export const useIsIframe = () => {
  const [isIframe, setIsIframe] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsIframe(window.top !== window.self)
    }
  }, [])

  return isIframe
}
