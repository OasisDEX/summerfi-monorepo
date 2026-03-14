'use client'

import {
  LocalConfigContextProvider,
  type LocalConfigState,
  type SavedAnalyticsCookiesSettings,
} from '@summerfi/app-earn-ui'
import { type DeviceType, type EarnAppConfigType } from '@summerfi/app-types'
import dynamic from 'next/dynamic'

import { MasterPage } from '@/components/layout/MasterPage/MasterPage'
import { type SavedLargeUserBannerSettings } from '@/components/molecules/LargeUserFloatingBanner/LargeUserFloatingBanner'
import { GlobalEventTracker } from '@/components/organisms/Events/GlobalEventTracker'
import { DeviceProvider } from '@/contexts/DeviceContext/DeviceContext'
import { SystemConfigProvider } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { WalletProvider } from '@/providers/WalletProvider/WalletProvider'

type GlobalProviderProps = {
  children: React.ReactNode
  config: Partial<EarnAppConfigType>
  deviceType: DeviceType
  localConfigContextState: Partial<LocalConfigState>
  analyticsCookie: SavedAnalyticsCookiesSettings | null
  largeUsersCookie: SavedLargeUserBannerSettings | null
  largeUsersData?: string[]
  sumrPriceUsd?: number
}

const TheGame = dynamic(() => import('../../../features/game/components/MainGameView'), {
  ssr: false,
})

export const GlobalProvider = ({
  children,
  config,
  deviceType,
  localConfigContextState,
  analyticsCookie,
  largeUsersData,
  largeUsersCookie,
  sumrPriceUsd,
}: GlobalProviderProps) => {
  return (
    <SystemConfigProvider value={config}>
      <DeviceProvider value={deviceType}>
        <LocalConfigContextProvider value={localConfigContextState}>
          <WalletProvider>
            <GlobalEventTracker />
            <MasterPage
              analyticsCookie={analyticsCookie}
              largeUsersData={largeUsersData}
              largeUsersCookie={largeUsersCookie}
              sumrPriceUsd={sumrPriceUsd}
            >
              {children}
            </MasterPage>
            <TheGame />
          </WalletProvider>
        </LocalConfigContextProvider>
      </DeviceProvider>
    </SystemConfigProvider>
  )
}
