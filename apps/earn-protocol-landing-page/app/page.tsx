'use client'

import {
  BigGradientBox,
  EXTERNAL_LINKS,
  HeaderDisclaimer,
  HighestQualityYieldsDisclaimer,
} from '@summerfi/app-earn-ui'
import Link from 'next/link'

import {
  EffortlessAccessBlock,
  EnhancedRiskManagement,
  HigherYieldsBlock,
  LandingPageHero,
  MarketingPoints,
  ProtocolScroller,
  SummerFiProBox,
  SupportedNetworksList,
} from '@/components/layout/LandingPageContent'
import { Audits } from '@/components/layout/LandingPageContent/content/Audits'
import { BestOfDecentralizedFinance } from '@/components/layout/LandingPageContent/content/BestOfDecentralisedFinance'
import { BuildBySummerFi } from '@/components/layout/LandingPageContent/content/BuildBySummerFi'
import { CryptoUtilities } from '@/components/layout/LandingPageContent/content/CryptoUtilities'
import { LandingFaqSection } from '@/components/layout/LandingPageContent/content/LandingFaqSection'
import { ProtocolStats } from '@/components/layout/LandingPageContent/content/ProtocolStats'
import { StartEarningNow } from '@/components/layout/LandingPageContent/content/StartEarningNow'
import { SummerFiProSection } from '@/components/layout/LandingPageContent/content/SummerFiProSection'
import { SumrToken } from '@/components/layout/LandingPageContent/content/SumrToken'
import { useLandingPageData } from '@/contexts/LandingPageContext'

export default function HomePage() {
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
          >
            Read more
          </Link>
        </HeaderDisclaimer>
      )}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 24px',
        }}
      >
        <LandingPageHero
          vaultsList={landingPageData?.vaultsWithConfig}
          vaultsApyByNetworkMap={landingPageData?.vaultsApyByNetworkMap}
        />
        <ProtocolStats vaultsList={landingPageData?.vaultsWithConfig} />
        <SummerFiProBox />
        <BigGradientBox>
          <EffortlessAccessBlock />
          <SupportedNetworksList />
        </BigGradientBox>
        <ProtocolScroller protocolTvls={landingPageData?.protocolTvls} />
        <MarketingPoints>
          <HigherYieldsBlock vaultsList={landingPageData?.vaultsWithConfig} />
          <EnhancedRiskManagement protectedCapital="$10B+" />
          <BestOfDecentralizedFinance />
          <SumrToken />
          <StartEarningNow />
          <SummerFiProSection />
          <CryptoUtilities />
          <Audits />
          <BuildBySummerFi />
          <LandingFaqSection />
          <HighestQualityYieldsDisclaimer />
        </MarketingPoints>
      </div>
    </>
  )
}
