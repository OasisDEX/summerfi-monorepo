import * as React from 'react'
import { SDKContextProvider } from './SDKContext'

export function SDKProvider({ children, apiURL }: { children: React.ReactNode; apiURL: string }) {
  const value = {
    apiURL,
  }

  return <SDKContextProvider value={value}>{children}</SDKContextProvider>
}
