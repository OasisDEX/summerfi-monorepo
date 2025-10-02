'use client'

import {
  Audits,
  BigGradientBox,
  EffortlessAccessBlock,
  EnhancedRiskManagement,
  HighestQualityYieldsDisclaimer,
  ProtocolStats,
  SupportedNetworksList,
} from '@summerfi/app-earn-ui'

import {
  HigherYieldsBlock,
  LandingPageHero,
  MarketingPoints,
  ProtocolScroller,
  SummerFiProBox,
} from '@/components/layout/LandingPageContent'
import { BestOfDecentralizedFinance } from '@/components/layout/LandingPageContent/content/BestOfDecentralisedFinance'
import { BuildBySummerFi } from '@/components/layout/LandingPageContent/content/BuildBySummerFi'
import { CryptoUtilities } from '@/components/layout/LandingPageContent/content/CryptoUtilities'
import { LandingFaqSection } from '@/components/layout/LandingPageContent/content/LandingFaqSection'
import { StartEarningNow } from '@/components/layout/LandingPageContent/content/StartEarningNow'
import { SummerFiProSection } from '@/components/layout/LandingPageContent/content/SummerFiProSection'
import { SumrToken } from '@/components/layout/LandingPageContent/content/SumrToken'
import { useLandingPageData } from '@/contexts/LandingPageContext'
import { EarnProtocolEvents } from '@/helpers/mixpanel'
import chainSecurityLogo from '@/public/img/landing-page/auditor-logos/chainsecurity.svg'
import prototechLabsLogo from '@/public/img/landing-page/auditor-logos/prototech-labs.svg'
import blockAnalyticaLogo from '@/public/img/landing-page/block-analytica.svg'
import arbitrumLogo from '@/public/img/landing-page/networks/arbitrum.svg'
import baseLogo from '@/public/img/landing-page/networks/base.svg'
import ethereumLogo from '@/public/img/landing-page/networks/ethereum.svg'
import aaveLogo from '@/public/img/landing-page/protocols/aave.svg'
import morphoBlueLogo from '@/public/img/landing-page/protocols/morpho-blue.svg'
import skyLogo from '@/public/img/landing-page/protocols/sky.svg'
import sparkLogo from '@/public/img/landing-page/protocols/spark.svg'

import rebalanceActivityImage from '@/public/img/landing-page/enhanced-risk-management_rebalance-activity.png'
import strategyExposureImage from '@/public/img/landing-page/enhanced-risk-management_strategy-exposure.png'
import summerEarnUi from '@/public/img/landing-page/summer-earn-ui.png'

export default function HomePage() {
  const { landingPageData } = useLandingPageData()

  const handleRiskManagementLearnMoreClick = () => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-enhanced-risk-management-learn-more`,
      page: '/',
    })
  }
  const handleAuditClick = (auditId: string) => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-audit-${auditId}-learn-more`,
      page: '/',
    })
  }

  return (
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
        vaultsInfo={landingPageData?.vaultsInfo}
        vaultsList={landingPageData?.vaultsWithConfig}
        vaultsApyByNetworkMap={landingPageData?.vaultsApyByNetworkMap}
      />
      <ProtocolStats
        vaultsList={landingPageData?.vaultsWithConfig}
        totalUniqueUsers={landingPageData?.totalUniqueUsers}
      />
      <SummerFiProBox />
      <BigGradientBox>
        <EffortlessAccessBlock uiImage={summerEarnUi} />
        <SupportedNetworksList
          networks={[
            { name: 'Ethereum', logo: ethereumLogo },
            { name: 'Base', logo: baseLogo },
            { name: 'Arbitrum', logo: arbitrumLogo },
          ]}
        />
      </BigGradientBox>
      <ProtocolScroller protocolTvls={landingPageData?.protocolTvls} />
      <MarketingPoints>
        <HigherYieldsBlock
          vaultsList={landingPageData?.vaultsWithConfig}
          totalRebalanceItemsPerStrategyId={landingPageData?.totalRebalanceItemsPerStrategyId}
        />
        <EnhancedRiskManagement
          protectedCapital="$10B+"
          imagesMap={{
            rebalanceActivityImage,
            strategyExposureImage,
            blockAnalyticaLogo,
            aaveLogo,
            morphoBlueLogo,
            skyLogo,
            sparkLogo,
          }}
          handleLearnMoreClick={handleRiskManagementLearnMoreClick}
        />
        <BestOfDecentralizedFinance />
        <SumrToken />
        <StartEarningNow id="home" />
        <SummerFiProSection />
        <CryptoUtilities />
        <Audits
          chainSecurityLogo={chainSecurityLogo}
          prototechLabsLogo={prototechLabsLogo}
          onAuditClick={handleAuditClick}
        />
        <BuildBySummerFi proAppStats={landingPageData?.proAppStats} />
        <LandingFaqSection />
        <HighestQualityYieldsDisclaimer />
      </MarketingPoints>
    </div>
  )
}
