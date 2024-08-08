/**
 * Check if the current environment is Server-Side Rendering (SSR).
 *
 * This function determines whether the current code is running in a server-side environment by checking if the `window` object is undefined.
 *
 * @returns A boolean indicating whether the current environment is SSR (true) or not (false).
 */
export const isSSR = () => typeof window === 'undefined'
