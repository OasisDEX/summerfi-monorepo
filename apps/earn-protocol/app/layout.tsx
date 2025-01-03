import { cookieToInitialState } from '@account-kit/core'
import { GlobalStyles } from '@summerfi/app-earn-ui'
import { type DeviceType } from '@summerfi/app-types'
import type { Metadata } from 'next'
import { cookies, headers } from 'next/headers'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

import { getAccountKitConfig } from '@/account-kit/config'
import { MasterPage } from '@/components/layout/MasterPage/MasterPage'
import { accountKitCookieStateName } from '@/constants/account-kit-cookie-state-name'
import { forksCookieName } from '@/constants/forks-cookie-name'
import { safeParseJson } from '@/constants/safe-parse-json'
import { DeviceProvider } from '@/contexts/DeviceContext/DeviceContext'
import {
  slippageConfigCookieName,
  sumrNetApyConfigCookieName,
} from '@/contexts/LocalConfigContext/constants'
import { LocalConfigContextProvider } from '@/contexts/LocalConfigContext/LocalConfigContext'
import { fontInter } from '@/helpers/fonts'
import { getServerSideCookies } from '@/helpers/get-server-side-cookies'
import { AlchemyAccountsProvider } from '@/providers/AlchemyAccountsProvider/AlchemyAccountsProvider'

export const metadata: Metadata = {
  title: 'Summer.fi Earn Protocol ⛱️',
  description: '⛱️',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
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
    headers().get('cookie') ?? undefined,
  )

  return (
    <html lang={locale}>
      <head>
        <GlobalStyles />
      </head>
      <body className={`${fontInter.variable}`}>
        <AlchemyAccountsProvider initialState={accountKitInitializedState}>
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
      </body>
    </html>
  )
}
