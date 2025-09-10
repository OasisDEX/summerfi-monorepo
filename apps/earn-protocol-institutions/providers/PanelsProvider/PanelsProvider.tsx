import { type FC, type PropsWithChildren } from 'react'

import { PanelAdminProvider } from '@/providers/PanelAdminProvider/PanelAdminProvider'
import { PanelClientProvider } from '@/providers/PanelClientProvider/PanelClientProvider'

const providers = [PanelAdminProvider, PanelClientProvider]

export const PanelsProvider: FC<PropsWithChildren> = ({ children }) => {
  return providers.reduceRight((acc, Provider) => {
    return <Provider>{acc}</Provider>
  }, children)
}
