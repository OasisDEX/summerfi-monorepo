'use client'

/**
 * Updates the browser URL without triggering a page reload
 * Safe to use in both client and server environments
 * @param url - The new URL to push to browser history
 */
export const softRouterPush = (url: string): void => {
  if (typeof window === 'undefined') return
  window.history.pushState(null, '', url)
}
