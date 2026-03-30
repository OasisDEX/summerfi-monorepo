'use client'
import { useMemo } from 'react'
import { Button, Emphasis, getVaultsProtocolsList, Text } from '@summerfi/app-earn-ui'
import {
  type GetVaultsApyResponse,
  type IArmadaVaultInfo,
  type RewardTokenPrices,
  type SDKVaultishType,
} from '@summerfi/app-types'
import Link from 'next/link'

import { EarnProtocolEvents } from '@/helpers/mixpanel'

import landingPageHeroStyles from '@/components/layout/LandingPageContent/components/LandingPageHero.module.css'

export const LandingPageHero = ({
  vaultsList,
  vaultsApyByNetworkMap: _vaultsApyByNetworkMap,
  vaultsInfo: _vaultsInfo,
  rewardTokenPrices: _rewardTokenPrices,
}: {
  vaultsList?: SDKVaultishType[]
  vaultsApyByNetworkMap?: GetVaultsApyResponse
  vaultsInfo?: IArmadaVaultInfo[]
  rewardTokenPrices?: RewardTokenPrices
}) => {
  const heroStats = useMemo(() => {
    const formattedProtocolsSupportedList = getVaultsProtocolsList(vaultsList ?? [])

    return [
      { label: 'Total Rebalances', value: '-' },
      { label: 'Hours of user time saved', value: '-' },
      {
        label: 'Markets Optimized',
        value: formattedProtocolsSupportedList.allVaultsProtocols.length,
      },
      { label: 'Max APY', value: '-' },
    ]
  }, [vaultsList])

  const handleGetStartedClick = () => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-get-started`,
      page: '/',
    })
  }

  const handleViewProductsClick = () => {
    EarnProtocolEvents.buttonClicked({
      buttonName: 'lp-view-products-hero',
      page: '/',
    })
  }

  return (
    <div className={landingPageHeroStyles.landingPageHeroWrapper}>
      <div className={landingPageHeroStyles.heroHeader}>
        <div className={landingPageHeroStyles.heroTextGroup}>
          <Text variant="h1" as="h1" className={landingPageHeroStyles.heroTitle}>
            <Emphasis variant="h1colorful">Earn more</Emphasis>, do less
          </Text>
          <Text variant="p1" className={landingPageHeroStyles.heroSubtitle}>
            Institutional DeFi Vault infrastructure for everyone.
          </Text>
        </div>
        <div className={landingPageHeroStyles.heroButtons}>
          <Link
            href="/earn"
            prefetch={false}
            className={landingPageHeroStyles.primaryCta}
            onClick={() => handleGetStartedClick()}
          >
            <Button variant="primarySmall">Launch App</Button>
          </Link>
          <Link
            href="/earn"
            prefetch={false}
            className={landingPageHeroStyles.primaryCta}
            onClick={() => handleViewProductsClick()}
          >
            <Button variant="secondarySmall">View Products</Button>
          </Link>
        </div>
        <div className={landingPageHeroStyles.heroStats}>
          {heroStats.map((stat, index) => (
            <div className={landingPageHeroStyles.heroStat} key={stat.label}>
              <Text variant="p4semi" as="p" className={landingPageHeroStyles.heroStatLabel}>
                {stat.label}
              </Text>
              <Text variant="h4" as="p" className={landingPageHeroStyles.heroStatValue}>
                {stat.value}
              </Text>
              {index < heroStats.length - 1 && (
                <span className={landingPageHeroStyles.heroStatDivider} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
