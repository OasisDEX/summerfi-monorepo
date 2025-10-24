'use client'

import { type FC, type PropsWithChildren } from 'react'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { sdkApiUrl } from '@/constants/sdk'
import { PanelRiskParametersProvider } from '@/providers/PanekRiskParametersProvider/PanelRiskParametersProvider'
import { PanelClientProvider } from '@/providers/PanelClientProvider/PanelClientProvider'
import { PanelFeeRevenueAdminProvider } from '@/providers/PanelFeeRevenueAdminProvider/PanelFeeRevenueAdminProvider'

const providers = [
  ({ children }: PropsWithChildren) => (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>{children}</SDKContextProvider>
  ),
  PanelClientProvider,
  PanelRiskParametersProvider,
  PanelFeeRevenueAdminProvider,
]

export const PanelsProvider: FC<PropsWithChildren> = ({ children }) => {
  return providers.reduceRight((acc, Provider) => {
    return <Provider>{acc}</Provider>
  }, children)
}
