import * as React from 'react'
import { SDKContextProvider } from './SDKContext'

/**
 * Top-level provider that makes the SDK configuration available to all descendant components,
 * enabling the {@link useSDK} and {@link useSDKContext} hooks to resolve their context.
 *
 * @param props - Component props.
 * @param props.children - The React subtree that should have access to the SDK context.
 * @param props.apiURL - Base URL of the Summer.fi SDK API endpoint to target.
 * @returns A context provider element wrapping `children`.
 */
export function SDKProvider({ children, apiURL }: { children: React.ReactNode; apiURL: string }) {
  const value = {
    apiURL,
  }

  return <SDKContextProvider value={value}>{children}</SDKContextProvider>
}
