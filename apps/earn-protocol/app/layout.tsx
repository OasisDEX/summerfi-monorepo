import { cookieToInitialState } from '@alchemy/aa-alchemy/config'
import { GlobalStyles } from '@summerfi/app-ui'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

import { MasterPage } from '@/components/layout/MasterPage/MasterPage'
import { fontFtPolar, fontInter } from '@/helpers/fonts'
import { Providers } from '@/providers/AlchemyAccountsProvider/AlchemyAccountsProvider'
import { config } from '@/providers/AlchemyAccountsProvider/config'

export const metadata: Metadata = {
  title: 'Summer.fi Earn Protocol',
  description: '⛱️',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()

  const messages = await getMessages()

  // hydrate the initial state on the client
  const initialState = cookieToInitialState(config, headers().get('cookie') ?? undefined)

  return (
    <html lang={locale}>
      <head>
        <GlobalStyles />
      </head>
      <body className={`${fontFtPolar.variable} ${fontInter.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <Providers initialState={initialState}>
            <MasterPage>{children}</MasterPage>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
