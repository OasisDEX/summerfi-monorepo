import { GlobalStyles } from '@summerfi/app-ui'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

import { MasterPage } from '@/components/layout/MasterPage/MasterPage'
import { fontFtPolar, fontInter } from '@/helpers/fonts'

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
      <body className={`${fontFtPolar.variable} ${fontInter.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <MasterPage>{children}</MasterPage>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
