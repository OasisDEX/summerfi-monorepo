import { createContext, useContext } from 'react'

// don't expose the contex to consumers, should be accessed by the hook
const SDKContext = createContext<Partial<SDKContextType>>({
  apiURL: undefined,
})

export const SDKContextProvider = SDKContext.Provider

export type SDKContextType = {
  apiURL: string
}

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
