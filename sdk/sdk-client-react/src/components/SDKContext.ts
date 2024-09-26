import * as React from 'react'

// don't expose the contex to consumers, should be accessed by the hook
const SDKContext = React.createContext<Partial<SDKContextType>>({
  apiURL: undefined,
})

export const SDKContextProvider = SDKContext.Provider

export type SDKContextType = {
  apiURL: string
}

export function useSDKContext() {
  const { apiURL } = React.useContext(SDKContext)

  // validate that the context value is initialized
  if (!apiURL) {
    throw new Error('SDKContext is not initialized')
  }

  return {
    apiURL,
  }
}
