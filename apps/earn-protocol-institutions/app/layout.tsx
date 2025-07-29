import { ToastContainer } from 'react-toastify'
import { cookieToInitialState } from '@account-kit/core'
import {
  accountKitCookieStateName,
  analyticsCookieName,
  forksCookieName,
  getAccountKitConfig,
  GlobalIssueBanner,
  GlobalStyles,
  GoogleTagManager,
  slippageConfigCookieName,
  sumrNetApyConfigCookieName,
  Text,
} from '@summerfi/app-earn-ui'
import { DeviceType } from '@summerfi/app-types'
import { getDeviceType, getServerSideCookies, safeParseJson } from '@summerfi/app-utils'
import type { Metadata } from 'next'
import { cookies, headers } from 'next/headers'
import Image from 'next/image'
import Script from 'next/script'

import systemConfigHandler from '@/app/server-handlers/system-config'
import { MasterPage } from '@/components/layout/MasterPage/MasterPage'
import { GlobalProvider } from '@/components/organisms/GlobalProvider/GlobalProvider'
import { fontInter } from '@/helpers/fonts'
import logoMaintenance from '@/public/img/branding/logo-dark.svg'

export const metadata: Metadata = {
  title: 'The home of the Lazy Summer Protocol for Institutions',
  description: 'Institutional DeFi vaults',
}

const reactScanDebug = false

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [{ config }] = await Promise.all([systemConfigHandler()])

  const cookieRaw = await cookies()
  const cookie = cookieRaw.toString()
  const headersList = await headers()

  const locale = 'en'

  const analyticsCookie = safeParseJson(getServerSideCookies(analyticsCookieName, cookie))

  // Get device type from cookie or detect it from user agent
  let deviceType = getServerSideCookies('deviceType', cookie) as DeviceType | ''

  if (!deviceType) {
    const userAgent = headersList.get('user-agent')

    if (userAgent) {
      const { deviceType: detectedType } = getDeviceType(userAgent)

      deviceType = detectedType
    }
  }

  const resolvedDeviceType = deviceType || DeviceType.DESKTOP

  if (config.maintenance && process.env.NODE_ENV !== 'development') {
    return (
      <html lang={locale} suppressHydrationWarning style={{ backgroundColor: '#1c1c1c' }}>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <GlobalStyles />
        </head>
        <body className={`${fontInter.className} ${fontInter.variable}`}>
          {config.bannerMessage && <GlobalIssueBanner message={config.bannerMessage} />}
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
  const chainId: number | undefined = accountKitState.state?.chainId
  const forkRpcUrl: string | undefined = chainId ? forks[chainId] : undefined

  const accountKitInitializedState = cookieToInitialState(
    getAccountKitConfig({ forkRpcUrl, chainId }),
    (await headers()).get('cookie') ?? undefined,
  )

  const sumrNetApyConfig = safeParseJson(getServerSideCookies(sumrNetApyConfigCookieName, cookie))
  const slippageConfig = safeParseJson(getServerSideCookies(slippageConfigCookieName, cookie))

  // the style on the html tag is needed to prevent a flash of white background on page load
  return (
    <html lang={locale} suppressHydrationWarning style={{ backgroundColor: '#1c1c1c' }}>
      <head>
        <GlobalStyles />
        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
        {reactScanDebug && (
          <Script
            src="https://cdn.jsdelivr.net/npm/react-scan/dist/auto.global.js"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className={`${fontInter.className} ${fontInter.variable}`}>
        {config.bannerMessage && <GlobalIssueBanner message={config.bannerMessage} />}
        <GoogleTagManager />
        <GlobalProvider
          accountKitInitializedState={accountKitInitializedState}
          config={config}
          analyticsCookie={analyticsCookie}
          deviceType={resolvedDeviceType}
          localConfigContextState={{
            slippageConfig,
            sumrNetApyConfig,
          }}
        >
          {children}
        </GlobalProvider>
        <div id="portal" style={{ position: 'absolute' }} />
        {/* Separate portal for dropdown is needed to not mix up position calculation */}
        <div id="portal-dropdown" style={{ position: 'absolute' }} />
        <ToastContainer />
      </body>
    </html>
  )
}
