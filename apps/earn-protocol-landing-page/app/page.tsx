'use client'

import { Audits, LatestNews } from '@summerfi/app-earn-ui'
import { usePathname } from 'next/navigation'

import { LandingPageHero, ProtocolScroller } from '@/components/layout/LandingPageContent'
import { OurProducts } from '@/components/layout/LandingPageContent/components/OurProducts'
import { YieldProtocolOpenToAll } from '@/components/layout/LandingPageContent/components/YieldProtocolOpenToAll'
import { BuildBySummerFiPlain } from '@/components/layout/LandingPageContent/content/BuildBySummerFi'
import { LandingFaqSection } from '@/components/layout/LandingPageContent/content/LandingFaqSection'
import { useLandingPageData } from '@/contexts/LandingPageContext'
import { EarnProtocolEvents } from '@/helpers/mixpanel'
import chainSecurityLogo from '@/public/img/landing-page/auditor-logos/chainsecurity.svg'
import prototechLabsLogo from '@/public/img/landing-page/auditor-logos/prototech-labs.svg'
import sherlockLogo from '@/public/img/landing-page/auditor-logos/sherlock.svg'

export default function HomePage() {
  const { landingPageData } = useLandingPageData()
  const pathname = usePathname()

  const handleAuditClick = (auditId: string) => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-audit-${auditId}-learn-more`,
      page: pathname,
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '24px',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 24px',
      }}
    >
      <LandingPageHero
        vaultsInfo={landingPageData?.vaultsInfo}
        vaultsList={landingPageData?.vaultsWithConfig}
        vaultsApyByNetworkMap={landingPageData?.vaultsApyByNetworkMap}
        rewardTokenPrices={landingPageData?.rewardTokenPrices}
        tvl={landingPageData?.tvl}
      />
      <ProtocolScroller protocolTvls={landingPageData?.protocolTvls} />
      <YieldProtocolOpenToAll />
      <OurProducts
        vaultsInfo={landingPageData?.vaultsInfo}
        vaultsList={landingPageData?.vaultsWithConfig}
        vaultsApyByNetworkMap={landingPageData?.vaultsApyByNetworkMap}
        rewardTokenPrices={landingPageData?.rewardTokenPrices}
      />
      <LatestNews news={landingPageData?.blogPosts} />
      <div
        style={{
          marginTop: 'var(--spacing-space-3x-large)',
          paddingTop: 'var(--spacing-space-3x-large)',
          width: '100%',
        }}
      >
        <Audits
          noHeader
          chainSecurityLogo={chainSecurityLogo}
          prototechLabsLogo={prototechLabsLogo}
          sherlockLogo={sherlockLogo}
          onAuditClick={handleAuditClick}
        />
      </div>
      <div
        style={{
          marginTop: 'var(--spacing-space-3x-large)',
          paddingTop: 'var(--spacing-space-3x-large)',
          width: '100%',
        }}
      >
        <BuildBySummerFiPlain />
      </div>
      <div
        style={{
          marginTop: 'var(--spacing-space-3x-large)',
          marginBottom: 'var(--spacing-space-3x-large)',
          width: '100%',
        }}
      >
        <LandingFaqSection />
      </div>
    </div>
  )
}
