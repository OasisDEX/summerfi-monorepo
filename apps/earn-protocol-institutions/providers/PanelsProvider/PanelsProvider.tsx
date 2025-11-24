'use client'

import { type FC, type PropsWithChildren } from 'react'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { sdkApiUrl } from '@/constants/sdk'
import { PanelFeeRevenueAdminProvider } from '@/providers/PanelFeeRevenueAdminProvider/PanelFeeRevenueAdminProvider'
import { PanelUserProvider } from '@/providers/PanelUserProvider/PanelUserProvider'

const providers = [
  ({ children }: PropsWithChildren) => (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>{children}</SDKContextProvider>
  ),
  PanelUserProvider,
  PanelFeeRevenueAdminProvider,
]

export const PanelsProvider: FC<PropsWithChildren> = ({ children }) => {
  return providers.reduceRight((acc, Provider) => {
    return <Provider>{acc}</Provider>
  }, children)
}
