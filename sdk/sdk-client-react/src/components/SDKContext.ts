import { createContext, useContext } from 'react'

// don't expose the contex to consumers, should be accessed by the hook
const SDKContext = createContext<Partial<SDKContextType>>({
  apiURL: undefined,
})

/**
 * React context provider that supplies the SDK configuration (such as `apiURL`) to descendant
 * components; consumers should read it via {@link useSDKContext} rather than this provider directly.
 */
export const SDKContextProvider = SDKContext.Provider

/** Shape of the value carried by the SDK React context. */
export type SDKContextType = {
  apiURL: string
}

/**
 * Reads the SDK configuration from the surrounding {@link SDKContextProvider}.
 *
 * @returns The initialized SDK context value containing the configured `apiURL`.
 * @throws Error if used outside of an initialized provider (i.e. when `apiURL` is missing).
 */
export function useSDKContext() {
  const { apiURL } = useContext(SDKContext)

  // validate that the context value is initialized
  if (!apiURL) {
    throw new Error('SDKContext is not initialized')
  }

  return {
    apiURL,
  }
}
