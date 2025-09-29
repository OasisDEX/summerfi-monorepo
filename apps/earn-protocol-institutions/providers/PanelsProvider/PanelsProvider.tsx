import { type FC, type PropsWithChildren } from 'react'

import { PanelRiskParametersProvider } from '@/providers/PanekRiskParametersProvider/PanelRiskParametersProvider'
import { PanelAdminProvider } from '@/providers/PanelAdminProvider/PanelAdminProvider'
import { PanelClientProvider } from '@/providers/PanelClientProvider/PanelClientProvider'
import { PanelFeeRevenueAdminProvider } from '@/providers/PanelFeeRevenueAdminProvider/PanelFeeRevenueAdminProvider'

const providers = [
  PanelAdminProvider,
  PanelClientProvider,
  PanelRiskParametersProvider,
  PanelFeeRevenueAdminProvider,
]

export const PanelsProvider: FC<PropsWithChildren> = ({ children }) => {
  return providers.reduceRight((acc, Provider) => {
    return <Provider>{acc}</Provider>
  }, children)
}
