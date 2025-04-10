'use client'

import { useEffect, useState } from 'react'

export const useHoldAlt = (): boolean => {
  const [isAltPressed, setIsAltPressed] = useState(false)

  useEffect(() => {
    const handleKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Alt') {
        setIsAltPressed(true)
      }
    }

    const handleKeyUp = (ev: KeyboardEvent) => {
      if (ev.key === 'Alt') {
        setIsAltPressed(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return isAltPressed
}
