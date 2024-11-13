import { cookieToInitialState } from '@account-kit/core'
import { GlobalStyles } from '@summerfi/app-earn-ui'
import { type DeviceType } from '@summerfi/app-types'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

import { getAccountKitConfig } from '@/account-kit/config'
import { MasterPage } from '@/components/layout/MasterPage/MasterPage'
import { accountKitCookieStateName } from '@/constants/account-kit-cookie-state-name'
import { forksCookieName } from '@/constants/forks-cookie-name'
import { safeParseJson } from '@/constants/safe-parse-json'
import { DeviceProvider } from '@/contexts/DeviceContext/DeviceContext'
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

  const cookie = headers().get('cookie')

  const forks = safeParseJson(getServerSideCookies(forksCookieName, cookie))
  const accountKitState = safeParseJson(getServerSideCookies(accountKitCookieStateName, cookie))
  const deviceType = getServerSideCookies('deviceType', cookie) as DeviceType

  const chainId: number | undefined = accountKitState.state?.chainId
  const forkRpcUrl: string | undefined = chainId ? forks[chainId] : undefined

  const accountKitInitializedState = cookieToInitialState(
    getAccountKitConfig({ forkRpcUrl, chainId }),
    cookie ?? undefined,
  )

  return (
    <html lang={locale}>
      <head>
        <GlobalStyles />
      </head>
      <body className={` ${fontInter.variable}`} style={{ backgroundColor: '#1B1B1B' }}>
        <AlchemyAccountsProvider initialState={accountKitInitializedState}>
          <NextIntlClientProvider messages={messages}>
            <DeviceProvider value={deviceType}>
              <MasterPage>{children}</MasterPage>
            </DeviceProvider>
          </NextIntlClientProvider>
        </AlchemyAccountsProvider>
        <div id="portal" style={{ position: 'absolute' }} />
      </body>
    </html>
  )
}
