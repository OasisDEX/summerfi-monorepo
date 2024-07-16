import { useEffect, useState } from 'react'

/**
 * Custom hook that returns a boolean indicating whether the component is mounted on the client side.
 * Usage with the client side components that gets hydration errors on the server side.
 * @returns {boolean} Returns `true` if the component is mounted on the client side, otherwise `false`.
 */
export const useClientSideMount = (): boolean => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return false
  }

  return true
}
