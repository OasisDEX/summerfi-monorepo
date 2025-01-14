import {
  GlobalStyles,
  LocalConfigContextProvider,
  slippageConfigCookieName,
  sumrNetApyConfigCookieName,
} from '@summerfi/app-earn-ui'
import { getServerSideCookies, safeParseJson } from '@summerfi/app-utils'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

import { LandingMasterPage } from '@/components/layout/LandingMasterPage/LandingMasterPage'
import { fontInter } from '@/helpers/fonts'

export const metadata: Metadata = {
  title: 'Summer.fi Earn Protocol Landing Page ⛱️',
  description: '⛱️',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()

  const cookieRaw = await cookies()
  const cookie = cookieRaw.toString()

  const sumrNetApyConfig = safeParseJson(getServerSideCookies(sumrNetApyConfigCookieName, cookie))
  const slippageConfig = safeParseJson(getServerSideCookies(slippageConfigCookieName, cookie))

  return (
    <html lang={locale}>
      <head>
        <GlobalStyles />
      </head>
      <body className={` ${fontInter.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <LocalConfigContextProvider value={{ sumrNetApyConfig, slippageConfig }}>
            <LandingMasterPage>{children}</LandingMasterPage>
          </LocalConfigContextProvider>
        </NextIntlClientProvider>
        <div id="portal" style={{ position: 'absolute' }} />
      </body>
    </html>
  )
}
