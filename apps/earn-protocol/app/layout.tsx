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

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { MasterPage } from '@/components/layout/MasterPage/MasterPage'
import { largeUsersCookieName } from '@/components/molecules/LargeUserFloatingBanner/config'
import { GlobalProvider } from '@/components/organisms/Providers/GlobalProvider'
import { fontInter } from '@/helpers/fonts'
import { getSeoKeywords } from '@/helpers/seo-keywords'
import logoMaintenance from '@/public/img/branding/logo-dark.svg'

import { getLargeUsers } from './server-handlers/dune/get-large-users'

export const metadata: Metadata = {
  title: 'The home of the Lazy Summer Protocol',
  description:
    "Get effortless access to crypto's best DeFi yields. Continually rebalanced by AI powered Keepers to earn you more while saving you time and reducing costs.",
  keywords: getSeoKeywords(),
}

const reactScanDebug = false

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [config, cookieRaw, headersList] = await Promise.all([
    getCachedConfig(),
    cookies(),
    headers(),
  ])

  const cookie = cookieRaw.toString()

  const locale = 'en'

  const analyticsCookie = safeParseJson(getServerSideCookies(analyticsCookieName, cookie))
  const largeUsersCookie = safeParseJson(getServerSideCookies(largeUsersCookieName, cookie))

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
          <MasterPage
            skipNavigation
            analyticsCookie={analyticsCookie}
            largeUsersCookie={largeUsersCookie}
          >
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

  const largeUsersData = await getLargeUsers()

  const forks = safeParseJson(getServerSideCookies(forksCookieName, cookie))
  const accountKitState = safeParseJson(getServerSideCookies(accountKitCookieStateName, cookie))
  const sumrNetApyConfig = safeParseJson(getServerSideCookies(sumrNetApyConfigCookieName, cookie))
  const slippageConfig = safeParseJson(getServerSideCookies(slippageConfigCookieName, cookie))

  const chainId: number | undefined = accountKitState.state?.chainId
  const forkRpcUrl: string | undefined = chainId ? forks[chainId] : undefined

  const accountKitInitializedState = cookieToInitialState(
    getAccountKitConfig({ forkRpcUrl, chainId, basePath: '/earn' }),
    (await headers()).get('cookie') ?? undefined,
  )

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
          largeUsersData={largeUsersData}
          largeUsersCookie={largeUsersCookie}
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
