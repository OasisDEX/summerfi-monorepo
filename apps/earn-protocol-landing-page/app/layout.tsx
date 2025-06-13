import { GlobalStyles, GoogleTagManager } from '@summerfi/app-earn-ui'
import type { Metadata } from 'next'
import Script from 'next/script'

import { LandingMasterPage } from '@/components/layout/LandingMasterPage/LandingMasterPage'
import { LandingPageBanners } from '@/components/layout/LandingPageContent/components/LandingPageBanners'
import { LandingPageDataContextProvider } from '@/contexts/LandingPageContext'
import { adRollPixelScript } from '@/helpers/adroll-pixel-script'
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
        <Script strategy="afterInteractive" id="adroll-pixel-script">
          {adRollPixelScript}
        </Script>
      </head>
      <body className={` ${fontInter.variable}`}>
        <GoogleTagManager />
        <LandingPageDataContextProvider>
          <LandingPageBanners />
          <LandingMasterPage>{children}</LandingMasterPage>
        </LandingPageDataContextProvider>
        <div id="portal" style={{ position: 'absolute' }} />
      </body>
    </html>
  )
}
