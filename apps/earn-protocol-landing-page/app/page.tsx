'use client'

import { LandingPageHero, ProtocolScroller } from '@/components/layout/LandingPageContent'
import { OurProducts } from '@/components/layout/LandingPageContent/components/OurProducts'
import { YieldProtocolOpenToAll } from '@/components/layout/LandingPageContent/components/YieldProtocolOpenToAll'
import { useLandingPageData } from '@/contexts/LandingPageContext'

export default function HomePage() {
  const { landingPageData } = useLandingPageData()

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
    </div>
  )
}
