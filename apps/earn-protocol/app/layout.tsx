import { ToastContainer } from 'react-toastify'
import { cookieToInitialState } from '@account-kit/core'
import {
  analyticsCookieName,
  GlobalStyles,
  GoogleTagManager,
  LocalConfigContextProvider,
  slippageConfigCookieName,
  sumrNetApyConfigCookieName,
  Text,
} from '@summerfi/app-earn-ui'
import { type DeviceType } from '@summerfi/app-types'
import { getServerSideCookies, safeParseJson } from '@summerfi/app-utils'
import { cookies, headers } from 'next/headers'
import Image from 'next/image'

import { getAccountKitConfig } from '@/account-kit/config'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { MasterPage } from '@/components/layout/MasterPage/MasterPage'
import { GlobalEventTracker } from '@/components/organisms/Events/GlobalEventTracker'
import { accountKitCookieStateName } from '@/constants/account-kit-cookie-state-name'
import { forksCookieName } from '@/constants/forks-cookie-name'
import { DeviceProvider } from '@/contexts/DeviceContext/DeviceContext'
import { SystemConfigProvider } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { fontInter } from '@/helpers/fonts'
import { AlchemyAccountsProvider } from '@/providers/AlchemyAccountsProvider/AlchemyAccountsProvider'
import logoMaintenance from '@/public/img/branding/logo-dark.svg'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [{ config }] = await Promise.all([systemConfigHandler()])

  const cookieRaw = await cookies()
  const cookie = cookieRaw.toString()

  const locale = 'en'

  const analyticsCookie = safeParseJson(getServerSideCookies(analyticsCookieName, cookie))

  if (config.maintenance && process.env.NODE_ENV !== 'development') {
    return (
      <html lang={locale} suppressHydrationWarning style={{ backgroundColor: '#1c1c1c' }}>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <GlobalStyles />
        </head>
        <body className={`${fontInter.className} ${fontInter.variable}`}>
          <GoogleTagManager />
          <MasterPage skipNavigation analyticsCookie={analyticsCookie}>
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
    <html lang={locale} suppressHydrationWarning style={{ backgroundColor: '#1c1c1c' }}>
      <head>
        <GlobalStyles />
      </head>
      <body className={`${fontInter.className} ${fontInter.variable}`}>
        <GoogleTagManager />
        <AlchemyAccountsProvider initialState={accountKitInitializedState}>
          <GlobalEventTracker />
          <SystemConfigProvider value={config}>
            <DeviceProvider value={deviceType}>
              <LocalConfigContextProvider value={{ sumrNetApyConfig, slippageConfig }}>
                <MasterPage analyticsCookie={analyticsCookie}>{children}</MasterPage>
              </LocalConfigContextProvider>
            </DeviceProvider>
          </SystemConfigProvider>
        </AlchemyAccountsProvider>
        <div id="portal" style={{ position: 'absolute' }} />
        {/* Separate portal for dropdown is needed to not mix up position calculation */}
        <div id="portal-dropdown" style={{ position: 'absolute' }} />
        <ToastContainer />
      </body>
    </html>
  )
}
