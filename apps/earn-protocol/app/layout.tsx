import { ToastContainer } from 'react-toastify'
import { cookieToInitialState } from '@account-kit/core'
import {
  GlobalStyles,
  LocalConfigContextProvider,
  slippageConfigCookieName,
  sumrNetApyConfigCookieName,
  Text,
} from '@summerfi/app-earn-ui'
import { type DeviceType } from '@summerfi/app-types'
import { getServerSideCookies, safeParseJson } from '@summerfi/app-utils'
import type { Metadata } from 'next'
import { cookies, headers } from 'next/headers'
import Image from 'next/image'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

import { getAccountKitConfig } from '@/account-kit/config'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { MasterPage } from '@/components/layout/MasterPage/MasterPage'
import { GlobalEventTracker } from '@/components/organisms/Events/GlobalEventTracker'
import { accountKitCookieStateName } from '@/constants/account-kit-cookie-state-name'
import { forksCookieName } from '@/constants/forks-cookie-name'
import { DeviceProvider } from '@/contexts/DeviceContext/DeviceContext'
import { fontInter } from '@/helpers/fonts'
import { AlchemyAccountsProvider } from '@/providers/AlchemyAccountsProvider/AlchemyAccountsProvider'
import logoMaintenance from '@/public/img/branding/logo-dark.svg'

export const metadata: Metadata = {
  title: 'The home of the Lazy Summer Protocol',
  description:
    'Get effortless access to crypto’s best DeFi yields. Continually rebalanced by AI powered Keepers to earn you more while saving you time and reducing costs.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [{ config }] = await Promise.all([systemConfigHandler()])

  const locale = await getLocale()

  if (config.maintenance && process.env.NODE_ENV !== 'development') {
    return (
      <html lang={locale} style={{ backgroundColor: '#1c1c1c' }}>
        <head>
          <GlobalStyles />
        </head>
        <body className={`${fontInter.variable}`}>
          <MasterPage skipNavigation>
            <Image src={logoMaintenance} alt="Summer.fi" width={200} style={{ margin: '4rem' }} />
            <Text as="h1" variant="h1" style={{ margin: '3rem 0 1rem', fontWeight: 700 }}>
              Maintenance
            </Text>
            <Text as="h1" variant="p2semi" style={{ marginBottom: '3rem' }}>
              Our app is down for maintenance. Come back soon!
            </Text>
          </MasterPage>
        </body>
      </html>
    )
  }
  const messages = await getMessages()

  const cookieRaw = await cookies()
  const cookie = cookieRaw.toString()

  const forks = safeParseJson(getServerSideCookies(forksCookieName, cookie))
  const accountKitState = safeParseJson(getServerSideCookies(accountKitCookieStateName, cookie))
  const deviceType = getServerSideCookies('deviceType', cookie) as DeviceType
  const sumrNetApyConfig = safeParseJson(getServerSideCookies(sumrNetApyConfigCookieName, cookie))
  const slippageConfig = safeParseJson(getServerSideCookies(slippageConfigCookieName, cookie))

  const chainId: number | undefined = accountKitState.state?.chainId
  const forkRpcUrl: string | undefined = chainId ? forks[chainId] : undefined

  const accountKitInitializedState = cookieToInitialState(
    getAccountKitConfig({ forkRpcUrl, chainId }),
    (await headers()).get('cookie') ?? undefined,
  )

  // the style on the html tag is needed to prevent a flash of white background on page load
  return (
    <html lang={locale} style={{ backgroundColor: '#1c1c1c' }}>
      <head>
        <GlobalStyles />
      </head>
      <body className={`${fontInter.variable}`}>
        <AlchemyAccountsProvider initialState={accountKitInitializedState}>
          <GlobalEventTracker />
          <NextIntlClientProvider messages={messages}>
            <DeviceProvider value={deviceType}>
              <LocalConfigContextProvider value={{ sumrNetApyConfig, slippageConfig }}>
                <MasterPage>{children}</MasterPage>
              </LocalConfigContextProvider>
            </DeviceProvider>
          </NextIntlClientProvider>
        </AlchemyAccountsProvider>
        <div id="portal" style={{ position: 'absolute' }} />
        {/* Separate portal for dropdown is needed to not mix up position calculation */}
        <div id="portal-dropdown" style={{ position: 'absolute' }} />
        <ToastContainer />
      </body>
    </html>
  )
}
