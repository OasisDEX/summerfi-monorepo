import {
  analyticsCookieName,
  EXTERNAL_LINKS,
  GlobalStyles,
  GoogleTagManager,
  HeaderDisclaimer,
  LocalConfigContextProvider,
  slippageConfigCookieName,
  sumrNetApyConfigCookieName,
} from '@summerfi/app-earn-ui'
import { getServerSideCookies, safeParseJson } from '@summerfi/app-utils'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'

import { LandingMasterPage } from '@/components/layout/LandingMasterPage/LandingMasterPage'
import { fontInter } from '@/helpers/fonts'

export const metadata: Metadata = {
  title: 'The home of the Lazy Summer Protocol',
  description:
    'Get effortless access to crypto’s best DeFi yields. Continually rebalanced by AI powered Keepers to earn you more while saving you time and reducing costs.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = 'en'

  const cookieRaw = await cookies()
  const cookie = cookieRaw.toString()

  const sumrNetApyConfig = safeParseJson(getServerSideCookies(sumrNetApyConfigCookieName, cookie))
  const slippageConfig = safeParseJson(getServerSideCookies(slippageConfigCookieName, cookie))
  const analyticsCookie = safeParseJson(getServerSideCookies(analyticsCookieName, cookie))
  const country = getServerSideCookies('country', cookie)

  const isGB = country === 'GB'

  return (
    <html lang={locale}>
      <head>
        <GlobalStyles />
      </head>
      <body className={` ${fontInter.variable}`}>
        <GoogleTagManager />
        <LocalConfigContextProvider value={{ sumrNetApyConfig, slippageConfig }}>
          {isGB && (
            <HeaderDisclaimer>
              UK disclaimer: This web application is provided as a tool for users to interact with
              third party DeFi protocols on their own initiative, with no endorsement or
              recommendation of ...
              <Link
                href={`${EXTERNAL_LINKS.KB.HELP}/legal/uk-disclaimer`}
                style={{
                  color: 'var(--earn-protocol-primary-100)',
                  paddingLeft: 'var(--general-space-4)',
                  fontWeight: '500',
                }}
                target="_blank"
              >
                Read more
              </Link>
            </HeaderDisclaimer>
          )}
          <LandingMasterPage analyticsCookie={analyticsCookie}>{children}</LandingMasterPage>
        </LocalConfigContextProvider>
        <div id="portal" style={{ position: 'absolute' }} />
      </body>
    </html>
  )
}
