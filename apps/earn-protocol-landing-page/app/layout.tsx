import {
  analyticsCookieName,
  EXTERNAL_LINKS,
  GlobalIssueBanner,
  GlobalStyles,
  GoogleTagManager,
  HeaderDisclaimer,
  LocalConfigContextProvider,
  slippageConfigCookieName,
  sumrNetApyConfigCookieName,
} from '@summerfi/app-earn-ui'
import { type DeviceType } from '@summerfi/app-types'
import { getServerSideCookies, safeParseJson } from '@summerfi/app-utils'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'

import { LandingMasterPage } from '@/components/layout/LandingMasterPage/LandingMasterPage'
import { DeviceProvider } from '@/contexts/DeviceContext/DeviceContext'
import { SystemConfigProvider } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { fontInter } from '@/helpers/fonts'

import systemConfigHandler from './server-handlers/system-config'

export const metadata: Metadata = {
  title: 'The home of the Lazy Summer Protocol',
  description:
    'Get effortless access to crypto’s best DeFi yields. Continually rebalanced by AI powered Keepers to earn you more while saving you time and reducing costs.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = 'en'

  const { config } = await systemConfigHandler()

  const cookieRaw = await cookies()
  const cookie = cookieRaw.toString()

  const sumrNetApyConfig = safeParseJson(getServerSideCookies(sumrNetApyConfigCookieName, cookie))
  const slippageConfig = safeParseJson(getServerSideCookies(slippageConfigCookieName, cookie))
  const deviceType = getServerSideCookies('deviceType', cookie) as DeviceType
  const analyticsCookie = safeParseJson(getServerSideCookies(analyticsCookieName, cookie))
  const country = getServerSideCookies('country', cookie)

  const isGB = country === 'GB'

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <GlobalStyles />
      </head>
      <body className={` ${fontInter.variable}`}>
        {config.bannerMessage && <GlobalIssueBanner message={config.bannerMessage} />}
        <GoogleTagManager />
        <SystemConfigProvider value={config}>
          <DeviceProvider value={deviceType}>
            <LocalConfigContextProvider value={{ sumrNetApyConfig, slippageConfig }}>
              {isGB && (
                <HeaderDisclaimer>
                  UK disclaimer: This web application is provided as a tool for users to interact
                  with third party DeFi protocols on their own initiative, with no endorsement or
                  recommendation of ...
                  <Link
                    href={`${EXTERNAL_LINKS.KB.HELP}/legal/uk-disclaimer`}
                    style={{
                      color: 'var(--earn-protocol-primary-100)',
                      fontWeight: '500',
                      paddingLeft: 'var(--general-space-4)',
                    }}
                    target="_blank"
                  >
                    Read more
                  </Link>
                </HeaderDisclaimer>
              )}
              <LandingMasterPage analyticsCookie={analyticsCookie}>{children}</LandingMasterPage>
            </LocalConfigContextProvider>
          </DeviceProvider>
        </SystemConfigProvider>
        <div id="portal" style={{ position: 'absolute' }} />
      </body>
    </html>
  )
}
