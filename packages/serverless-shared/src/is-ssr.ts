/**
 * Determines if the current environment is server-side rendering (SSR).
 *
 * This function checks if the code is running in a server-side environment by verifying
 * the presence of the `global` object and checking if the `window` object is undefined.
 * This is useful for distinguishing between client-side and server-side execution contexts.
 *
 * @returns `true` if the code is running on the server side (i.e., `window` is not defined), otherwise `false`.
 */
export const isSSR = () =>
  typeof global !== 'undefined' && 'window' in global && typeof global.window === 'undefined'
