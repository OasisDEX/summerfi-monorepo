import { GlobalStyles, GoogleTagManager } from '@summerfi/app-earn-ui'
import type { Metadata } from 'next'

import { LandingMasterPage } from '@/components/layout/LandingMasterPage/LandingMasterPage'
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

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <GlobalStyles />
      </head>
      <body className={` ${fontInter.variable}`}>
        <GoogleTagManager />
        <SystemConfigProvider value={config}>
          <LandingMasterPage>{children}</LandingMasterPage>
        </SystemConfigProvider>
        <div id="portal" style={{ position: 'absolute' }} />
      </body>
    </html>
  )
}
