'use client'
import { useEffect, useState } from 'react'

const checkIframe = () => {
  try {
    // Method 1: Check window.self vs window.top
    const topWindowCheck = window.self !== window.top
    // Method 2: Check parent origin access (throws error if cross-origin)
    const parentCheck = Boolean(window.parent && window.parent !== window)
    // Method 3: Check frameElement (null if not in iframe)
    const frameElementCheck = window.frameElement !== null

    return topWindowCheck || parentCheck || frameElementCheck
  } catch (e) {
    // If we get a security error, we're likely in a cross-origin iframe
    return true
  }
}

/**
 * Hook to detect if the current window is running inside an iframe
 * Multiple detection methods are used for better reliability
 * @returns {boolean} True if running in an iframe, false otherwise
 */
export const useIsIframe = (): boolean => {
  const [isIframe, setIsIframe] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsIframe(checkIframe())
    }
  }, [])

  return isIframe
}
