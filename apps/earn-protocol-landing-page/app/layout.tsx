import { GlobalStyles } from '@summerfi/app-earn-ui'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

import { MasterPage } from '@/components/layout/MasterPage/MasterPage'
import { fontInter } from '@/helpers/fonts'

export const metadata: Metadata = {
  title: 'Summer.fi Earn Protocol Landing Page ⛱️',
  description: '⛱️',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        <GlobalStyles />
      </head>
      <body className={` ${fontInter.variable}`} style={{ backgroundColor: '#1B1B1B' }}>
        <NextIntlClientProvider messages={messages}>
          <MasterPage>{children}</MasterPage>
        </NextIntlClientProvider>
        <div id="portal" style={{ position: 'absolute' }} />
      </body>
    </html>
  )
}
