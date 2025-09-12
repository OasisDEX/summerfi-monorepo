import { type FC, type PropsWithChildren } from 'react'

import { PanelRiskParametersProvider } from '@/providers/PanekRiskParametersProvider/PanelRiskParametersProvider'
import { PanelAdminProvider } from '@/providers/PanelAdminProvider/PanelAdminProvider'
import { PanelClientProvider } from '@/providers/PanelClientProvider/PanelClientProvider'

const providers = [PanelAdminProvider, PanelClientProvider, PanelRiskParametersProvider]

export const PanelsProvider: FC<PropsWithChildren> = ({ children }) => {
  return providers.reduceRight((acc, Provider) => {
    return <Provider>{acc}</Provider>
  }, children)
}
