'use client'

import { Suspense } from 'react'
import { type StoredState } from '@account-kit/core'
import {
  accountKitCookieStateName,
  forksCookieName,
  getAccountKitConfig,
  LocalConfigContextProvider,
  type LocalConfigState,
  type SavedAnalyticsCookiesSettings,
} from '@summerfi/app-earn-ui'
import { type DeviceType, type EarnAppConfigType } from '@summerfi/app-types'
import { getServerSideCookies, safeParseJson } from '@summerfi/app-utils'
import dynamic from 'next/dynamic'
import { WagmiProvider } from 'wagmi'

import { MasterPage } from '@/components/layout/MasterPage/MasterPage'
import { type SavedLargeUserBannerSettings } from '@/components/molecules/LargeUserFloatingBanner/LargeUserFloatingBanner'
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
  largeUsersCookie: SavedLargeUserBannerSettings | null
  largeUsersData?: string[]
  sumrPriceUsd?: number
  cookie: string
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
  cookie,
  accountKitInitializedState,
  config,
  deviceType,
  localConfigContextState,
  analyticsCookie,
  largeUsersData,
  largeUsersCookie,
  sumrPriceUsd,
}: GlobalProviderProps) => {
  const accountKitState = safeParseJson(getServerSideCookies(accountKitCookieStateName, cookie))
  const forks = safeParseJson(getServerSideCookies(forksCookieName, cookie))
  const chainId: number | undefined = accountKitState.state?.chainId
  const forkRpcUrl: string | undefined = chainId ? forks[chainId] : undefined
  const accountKitConfig = getAccountKitConfig({ forkRpcUrl, chainId, basePath: '/earn' })
  const { wagmiConfig } = accountKitConfig._internal

  return (
    <Suspense>
      <SystemConfigProvider value={config}>
        <DeviceProvider value={deviceType}>
          <LocalConfigContextProvider value={localConfigContextState}>
            <WagmiProvider config={wagmiConfig}>
              <AlchemyAccountsProvider initialState={accountKitInitializedState}>
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
              </AlchemyAccountsProvider>
            </WagmiProvider>
          </LocalConfigContextProvider>
        </DeviceProvider>
      </SystemConfigProvider>
    </Suspense>
  )
}
