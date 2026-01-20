'use client'
import { HomepageCarousel, SkeletonLine, Text, WithArrow } from '@summerfi/app-earn-ui'
import {
  type GetVaultsApyResponse,
  type IArmadaVaultInfo,
  type SDKVaultishType,
} from '@summerfi/app-types'
import Link from 'next/link'

import { EarnProtocolEvents } from '@/helpers/mixpanel'

import landingPageHeroStyles from '@/components/layout/LandingPageContent/components/LandingPageHero.module.css'

export const LandingPageHero = ({
  vaultsList,
  vaultsApyByNetworkMap,
  vaultsInfo,
  sumrPriceUsd,
}: {
  vaultsList?: SDKVaultishType[]
  vaultsApyByNetworkMap?: GetVaultsApyResponse
  vaultsInfo?: IArmadaVaultInfo[]
  sumrPriceUsd?: number
}) => {
  const headerPartA = (
    <Text
      as="h1"
      variant="h1"
      style={{
        color: 'var(--earn-protocol-secondary-100)',
        textAlign: 'center',
        fontWeight: '600',
      }}
    >
      Automated Exposure to DeFi’s
    </Text>
  )

  const headerPartB = (
    <Text
      as="h1"
      variant="h1"
      style={{
        color: 'var(--earn-protocol-primary-100)',
        textAlign: 'center',
        fontWeight: '600',
      }}
    >
      Highest Quality{' '}
      <span style={{ position: 'relative' }}>
        Yield
        <Text as="span" variant="p2" style={{ position: 'absolute', top: '-6px', right: '-8px' }}>
          1
        </Text>
      </span>
    </Text>
  )

  const handleGetStartedClick = (vault?: SDKVaultishType) => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-get-started-${vault?.inputToken.symbol}-${vault?.protocol.network}`,
      page: '/',
    })
  }

  return (
    <div className={landingPageHeroStyles.landingPageHeroWrapper}>
      <div className={landingPageHeroStyles.heroHeader}>
        <div className={landingPageHeroStyles.heroHeaderPartA}>{headerPartA}</div>
        <div className={landingPageHeroStyles.heroHeaderPartB}>{headerPartB}</div>
      </div>
      <HomepageCarousel
        vaultsList={vaultsList}
        vaultsApyByNetworkMap={vaultsApyByNetworkMap}
        vaultsInfo={vaultsInfo}
        onGetStartedClick={handleGetStartedClick}
        sumrPriceUsd={sumrPriceUsd}
      />
      <Link
        href="/earn"
        prefetch={false}
        onClick={() => {
          EarnProtocolEvents.buttonClicked({
            buttonName: 'lp-view-all-strategies',
            page: '/',
          })
        }}
      >
        <Text className={landingPageHeroStyles.viewAllStrategies} variant="p3semi">
          {vaultsList?.length ? (
            <WithArrow style={{ color: 'white' }}>
              View all {vaultsList.length} strategies
            </WithArrow>
          ) : (
            <SkeletonLine height={30} width={200} />
          )}
        </Text>
      </Link>
    </div>
  )
}
