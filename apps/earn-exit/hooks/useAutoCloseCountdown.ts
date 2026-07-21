'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Counts down from `totalSeconds` while `active` is true, then calls `onClose`. Returns the seconds
 * remaining (for a "closing in X" message). When `active` flips back to false — e.g. the user closes
 * the modal manually before the countdown ends — the timer is cleared and the count resets, so the
 * next time it becomes active it starts fresh from `totalSeconds`.
 */
export const useAutoCloseCountdown = (
  active: boolean,
  totalSeconds: number,
  onClose: () => void,
): number => {
  const [remaining, setRemaining] = useState(totalSeconds)

  // Keep the latest onClose without retriggering the interval effect.
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!active) {
      setRemaining(totalSeconds)

      return undefined
    }

    setRemaining(totalSeconds)
    const interval = setInterval(() => {
      setRemaining((previous) => Math.max(0, previous - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [active, totalSeconds])

  useEffect(() => {
    if (active && remaining === 0) onCloseRef.current()
  }, [active, remaining])

  return remaining
}
