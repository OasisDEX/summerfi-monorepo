'use client'

import { EXTERNAL_LINKS, HeaderDisclaimer } from '@summerfi/app-earn-ui'
import Link from 'next/link'
import Script from 'next/script'

import { useLandingPageData } from '@/contexts/LandingPageContext'
import { adRollPixelScript } from '@/helpers/adroll-pixel-script'

export const LandingPageBanners = () => {
  const { userConfig, landingPageData } = useLandingPageData()

  const isGB = userConfig?.country === 'GB'

  return (
    <>
      {isGB && (
        <HeaderDisclaimer>
          UK disclaimer: This web application is provided as a tool for users to interact with third
          party DeFi protocols on their own initiative, with no endorsement or recommendation of ...
          <Link
            href={`${EXTERNAL_LINKS.KB.HELP}/legal/uk-disclaimer`}
            style={{
              color: 'var(--earn-protocol-primary-100)',
              fontWeight: '500',
              paddingLeft: 'var(--general-space-4)',
            }}
            target="_blank"
            prefetch={false}
          >
            Read more
          </Link>
        </HeaderDisclaimer>
      )}
      {landingPageData?.systemConfig.features.AdrollPixelScript && userConfig?.analyticsCookie && (
        <Script strategy="afterInteractive" id="adroll-pixel-script">
          {adRollPixelScript}
        </Script>
      )}
    </>
  )
}
