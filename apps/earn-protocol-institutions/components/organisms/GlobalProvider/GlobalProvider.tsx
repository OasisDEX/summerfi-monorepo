'use client'

import { Suspense } from 'react'
import { type StoredState } from '@account-kit/core'
import { type SavedAnalyticsCookiesSettings } from '@summerfi/app-earn-ui'
import { type DeviceType, type EarnAppConfigType } from '@summerfi/app-types'
import dynamic from 'next/dynamic'

import { MasterPage } from '@/components/layout/MasterPage/MasterPage'
import { AuthContextProvider } from '@/contexts/AuthContext/AuthContext'
import { DeviceProvider } from '@/contexts/DeviceContext/DeviceContext'
import { SystemConfigProvider } from '@/contexts/SystemConfigContext/SystemConfigContext'

type GlobalProviderProps = {
  children: React.ReactNode
  accountKitInitializedState: StoredState | undefined
  config: Partial<EarnAppConfigType>
  deviceType: DeviceType
  analyticsCookie: SavedAnalyticsCookiesSettings | null
}

const AlchemyAccountsProvider = dynamic(
  () => import('@/providers/AlchemyAccountsProvider/AlchemyAccountsProvider'),
  {
    ssr: false,
  },
)

export const GlobalProvider = ({
  children,
  config,
  deviceType,
  accountKitInitializedState,
  analyticsCookie,
}: GlobalProviderProps) => {
  return (
    <Suspense>
      <AuthContextProvider>
        <SystemConfigProvider value={config}>
          <DeviceProvider value={deviceType}>
            <AlchemyAccountsProvider initialState={accountKitInitializedState}>
              <MasterPage analyticsCookie={analyticsCookie}>{children}</MasterPage>
            </AlchemyAccountsProvider>
          </DeviceProvider>
        </SystemConfigProvider>
      </AuthContextProvider>
    </Suspense>
  )
}
