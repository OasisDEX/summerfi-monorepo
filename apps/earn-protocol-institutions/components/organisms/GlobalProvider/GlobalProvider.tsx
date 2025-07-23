'use client'

import { Suspense } from 'react'
import {
  LocalConfigContextProvider,
  type LocalConfigState,
  type SavedAnalyticsCookiesSettings,
} from '@summerfi/app-earn-ui'
import { type DeviceType, type EarnAppConfigType } from '@summerfi/app-types'

import { MasterPage } from '@/components/layout/MasterPage/MasterPage'
import { DeviceProvider } from '@/contexts/DeviceContext/DeviceContext'
import { SystemConfigProvider } from '@/contexts/SystemConfigContext/SystemConfigContext'

type GlobalProviderProps = {
  children: React.ReactNode
  config: Partial<EarnAppConfigType>
  deviceType: DeviceType
  localConfigContextState: Partial<LocalConfigState>
  analyticsCookie: SavedAnalyticsCookiesSettings | null
}

export const GlobalProvider = ({
  children,
  config,
  deviceType,
  localConfigContextState,
  analyticsCookie,
}: GlobalProviderProps) => {
  return (
    <Suspense>
      <SystemConfigProvider value={config}>
        <DeviceProvider value={deviceType}>
          <LocalConfigContextProvider value={localConfigContextState}>
            <MasterPage analyticsCookie={analyticsCookie}>{children}</MasterPage>
          </LocalConfigContextProvider>
        </DeviceProvider>
      </SystemConfigProvider>
    </Suspense>
  )
}
