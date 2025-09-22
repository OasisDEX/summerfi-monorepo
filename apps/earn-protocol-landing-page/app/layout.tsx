import { Suspense } from 'react'
import { GlobalStyles, GoogleTagManager } from '@summerfi/app-earn-ui'
import type { Metadata } from 'next'

import { LandingMasterPage } from '@/components/layout/LandingMasterPage/LandingMasterPage'
import { LandingPageBanners } from '@/components/layout/LandingPageContent/components/LandingPageBanners'
import { LandingPageDataContextProvider } from '@/contexts/LandingPageContext'
import { fontInter } from '@/helpers/fonts'

export const metadata: Metadata = {
  title: 'The home of the Lazy Summer Protocol',
  description:
    'Get effortless access to crypto’s best DeFi yields. Continually rebalanced by AI powered Keepers to earn you more while saving you time and reducing costs.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <GlobalStyles />
      </head>
      <body className={` ${fontInter.variable}`}>
        <GoogleTagManager />
        <LandingPageDataContextProvider>
          <LandingPageBanners />
          <Suspense>
            <LandingMasterPage>{children}</LandingMasterPage>
          </Suspense>
        </LandingPageDataContextProvider>
        <div id="portal" style={{ position: 'absolute' }} />
      </body>
    </html>
  )
}
