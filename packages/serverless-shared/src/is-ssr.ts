/**
 * Determines if the current environment is Server-Side Rendering (SSR).
 *
 * This function checks whether the code is running in a server environment by verifying the existence and type of the `window` object in the global scope.
 *
 * @returns `true` if the environment is SSR (i.e., no `window` object exists), otherwise `false`.
 */
export const isSSR = () => 'window' in global && typeof global.window === 'undefined'
