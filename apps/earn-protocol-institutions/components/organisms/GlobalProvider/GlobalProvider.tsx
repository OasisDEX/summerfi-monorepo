'use client'

import { Suspense } from 'react'
import { type SavedAnalyticsCookiesSettings } from '@summerfi/app-earn-ui'
import { type DeviceType, type EarnAppConfigType } from '@summerfi/app-types'

import { MasterPage } from '@/components/layout/MasterPage/MasterPage'
import { AuthContextProvider } from '@/contexts/AuthContext/AuthContext'
import { DeviceProvider } from '@/contexts/DeviceContext/DeviceContext'
import { SystemConfigProvider } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { WalletProvider } from '@/providers/WalletProvider/WalletProvider'

type GlobalProviderProps = {
  children: React.ReactNode
  config: Partial<EarnAppConfigType>
  deviceType: DeviceType
  analyticsCookie: SavedAnalyticsCookiesSettings | null
}

export const GlobalProvider = ({
  children,
  config,
  deviceType,
  analyticsCookie,
}: GlobalProviderProps) => {
  return (
    <Suspense>
      <AuthContextProvider>
        <SystemConfigProvider value={config}>
          <DeviceProvider value={deviceType}>
            <WalletProvider>
              <MasterPage analyticsCookie={analyticsCookie}>{children}</MasterPage>
            </WalletProvider>
          </DeviceProvider>
        </SystemConfigProvider>
      </AuthContextProvider>
    </Suspense>
  )
}
