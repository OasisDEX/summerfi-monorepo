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
        <meta
          name="talentapp:project_verification"
          content="0b75101e3702b2f9ca1955662da1a08a4f0b2e5ca2bc8a4fb1b0ba65fe3d559da836a94b02a805e584bf3ad9f52f7011858049ead3a179a93a3d6d3a72b2b01b"
        />
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
