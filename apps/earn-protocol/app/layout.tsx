import { cookieToInitialState } from '@account-kit/core'
import { GlobalStyles } from '@summerfi/app-ui'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

import { getAccountKitConfig } from '@/account-kit/config'
import { MasterPage } from '@/components/layout/MasterPage/MasterPage'
import { accountKitCookieStateName } from '@/constants/account-kit-cookie-state-name'
import { forksCookieName } from '@/constants/forks-cookie-name'
import { safeParseJson } from '@/constants/safe-parse-json'
import { fontFtPolar, fontInter } from '@/helpers/fonts'
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

  const chainId: number | undefined = accountKitState.state?.chainId
  const forkRpcUrl: string | undefined = chainId ? forks[chainId] : undefined

  const accountKitInitialState = cookieToInitialState(
    getAccountKitConfig({ forkRpcUrl, chainId }),
    cookie ?? undefined,
  )

  return (
    <html lang={locale}>
      <head>
        <GlobalStyles />
      </head>
      <body className={`${fontFtPolar.variable} ${fontInter.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <AlchemyAccountsProvider
            initialState={accountKitInitialState}
            forkRpcUrl={forkRpcUrl}
            chainId={chainId}
          >
            <MasterPage>{children}</MasterPage>
          </AlchemyAccountsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
