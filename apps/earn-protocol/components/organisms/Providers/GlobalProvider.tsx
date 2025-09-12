'use client'

import { Suspense } from 'react'
import { type StoredState } from '@account-kit/core'
import {
  LocalConfigContextProvider,
  type LocalConfigState,
  type SavedAnalyticsCookiesSettings,
} from '@summerfi/app-earn-ui'
import { type DeviceType, type EarnAppConfigType } from '@summerfi/app-types'
import dynamic from 'next/dynamic'

import { MasterPage } from '@/components/layout/MasterPage/MasterPage'
import { type SavedBeachClubBannerSettings } from '@/components/molecules/BeachClubFloatingBanner/BeachClubFloatingBanner'
import { GlobalEventTracker } from '@/components/organisms/Events/GlobalEventTracker'
import { DeviceProvider } from '@/contexts/DeviceContext/DeviceContext'
import { SystemConfigProvider } from '@/contexts/SystemConfigContext/SystemConfigContext'

type GlobalProviderProps = {
  children: React.ReactNode
  accountKitInitializedState: StoredState | undefined
  config: Partial<EarnAppConfigType>
  deviceType: DeviceType
  localConfigContextState: Partial<LocalConfigState>
  analyticsCookie: SavedAnalyticsCookiesSettings | null
  beachClubCookie: SavedBeachClubBannerSettings | null
  largeUsersData?: string[]
}

const AlchemyAccountsProvider = dynamic(
  () => import('@/providers/AlchemyAccountsProvider/AlchemyAccountsProvider'),
  {
    ssr: false,
  },
)

const TheGame = dynamic(() => import('../../../features/game/components/MainGameView'), {
  ssr: false,
})

export const GlobalProvider = ({
  children,
  accountKitInitializedState,
  config,
  deviceType,
  localConfigContextState,
  analyticsCookie,
  beachClubCookie,
  largeUsersData,
}: GlobalProviderProps) => {
  return (
    <Suspense>
      <SystemConfigProvider value={config}>
        <DeviceProvider value={deviceType}>
          <LocalConfigContextProvider value={localConfigContextState}>
            <AlchemyAccountsProvider initialState={accountKitInitializedState}>
              <GlobalEventTracker />
              <MasterPage
                analyticsCookie={analyticsCookie}
                largeUsersData={largeUsersData}
                beachClubCookie={beachClubCookie}
              >
                {children}
              </MasterPage>
              <TheGame />
            </AlchemyAccountsProvider>
          </LocalConfigContextProvider>
        </DeviceProvider>
      </SystemConfigProvider>
    </Suspense>
  )
}
