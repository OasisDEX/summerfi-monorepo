'use client'
import { useLayoutEffect, useState } from 'react'
import { DeviceType } from '@summerfi/app-types'

interface ScreenInfo {
  isMobile: boolean
  width: number
  height: number
}

/**
 * Custom hook to check if the screen size is mobile and to track screen width and height.
 * This hook includes support for SSR by initializing with default values.
 *
 * @param deviceType - deviceType derived from User-Agent on server side, it's rough estimation (some client plugins / ad-blocks etc.
 * may limit or override amount of data exposed in User-Agent). In the best case scenario this allows to avoid flickering on UI.
 *
 * @returns An object containing:
 * - `isMobile`: A boolean indicating if the screen width is 768px or less.
 * - `width`: The current screen width in pixels, defaults to 0 in SSR.
 * - `height`: The current screen height in pixels, defaults to 0 in SSR.
 *
 * @example
 * const { isMobile, width, height } = useMobileCheck();
 * console.log(isMobile); // true if the screen width is 768px or less
 *
 * @remarks
 * - Adds an event listener to `window.resize` to update the screen information on resize.
 * - Automatically removes the event listener when the component using this hook unmounts.
 * - Checks if `window` is defined before accessing properties, making it safe for SSR.
 */
export const useMobileCheck = (deviceType?: DeviceType): ScreenInfo => {
  // Initialize with default values that assume a non-mobile, zero-width/height screen
  const [screenInfo, setScreenInfo] = useState<ScreenInfo>({
    isMobile: deviceType === DeviceType.MOBILE,
    width: 0,
    height: 0,
  })

  useLayoutEffect(() => {
    // Check if window is defined (important for SSR)
    if (typeof window === 'undefined' || typeof screen === 'undefined') return

    const handleResize = () => {
      setScreenInfo({
        isMobile: window.innerWidth <= 768,
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Set initial screen info when component mounts
    handleResize()

    // Listen for resize events
    window.addEventListener('resize', () => handleResize())
    screen.orientation.addEventListener('change', () => handleResize())

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('resize', () => handleResize())
      screen.orientation.removeEventListener('change', () => handleResize())
    }
  }, [])

  return screenInfo
}
