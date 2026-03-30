'use client'

import { Audits } from '@summerfi/app-earn-ui'
import { usePathname } from 'next/navigation'

import { LandingPageHero, ProtocolScroller } from '@/components/layout/LandingPageContent'
import { OurProducts } from '@/components/layout/LandingPageContent/components/OurProducts'
import { YieldProtocolOpenToAll } from '@/components/layout/LandingPageContent/components/YieldProtocolOpenToAll'
import { useLandingPageData } from '@/contexts/LandingPageContext'
import { EarnProtocolEvents } from '@/helpers/mixpanel'
import chainSecurityLogo from '@/public/img/landing-page/auditor-logos/chainsecurity.svg'
import prototechLabsLogo from '@/public/img/landing-page/auditor-logos/prototech-labs.svg'

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
        rewardTokenPrices={landingPageData?.rewardTokenPrices}
      />
      <ProtocolScroller protocolTvls={landingPageData?.protocolTvls} />
      <YieldProtocolOpenToAll />
      <OurProducts />
      <Audits
        chainSecurityLogo={chainSecurityLogo}
        prototechLabsLogo={prototechLabsLogo}
        onAuditClick={handleAuditClick}
      />
    </div>
  )
}
