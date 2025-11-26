'use client'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { sdkApiUrl } from '@/constants/sdk'

export const ClientSideSdkWrapper = ({ children }: { children: React.ReactNode }) => {
  return <SDKContextProvider value={{ apiURL: sdkApiUrl }}>{children}</SDKContextProvider>
}
