'use client'
import { useEffect, useState } from 'react'

interface ScreenInfo {
  isMobile: boolean
  width: number
  height: number
}

/**
 * Custom hook to check if the screen size is mobile and to track screen width and height.
 *
 * @returns An object containing:
 * - `isMobile`: A boolean indicating if the screen width is 768px or less.
 * - `width`: The current screen width in pixels.
 * - `height`: The current screen height in pixels.
 *
 * @example
 * const { isMobile, width, height } = useMobileCheck();
 * console.log(isMobile); // true if the screen width is 768px or less
 *
 * @remarks
 * - Adds an event listener to `window.resize` to update the screen information on resize.
 * - Automatically removes the event listener when the component using this hook unmounts.
 */

export const useMobileCheck = (): ScreenInfo => {
  const [screenInfo, setScreenInfo] = useState<ScreenInfo>({
    isMobile: window.innerWidth <= 768,
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setScreenInfo({
        isMobile: window.innerWidth <= 768,
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return screenInfo
}
