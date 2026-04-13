'use client'
import { useMemo } from 'react'
import {
  Button,
  Emphasis,
  getRewardsTokenBonus,
  getVaultsProtocolsList,
  SkeletonLine,
  Text,
} from '@summerfi/app-earn-ui'
import {
  type GetVaultsApyResponse,
  type IArmadaVaultInfo,
  type RewardTokenPrices,
  type SDKVaultishType,
  type TotalRebalanceItemsPerStrategyId,
} from '@summerfi/app-types'
import {
  findVaultInfo,
  formatDecimalAsPercent,
  getRebalanceSavedTimeInHours,
  subgraphNetworkToId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import Link from 'next/link'

import { getManagementFee } from '@/helpers/get-management-fee'
import { EarnProtocolEvents } from '@/helpers/mixpanel'

import landingPageHeroStyles from '@/components/layout/LandingPageContent/components/LandingPageHero.module.css'

export const LandingPageHero = ({
  vaultsList,
  vaultsApyByNetworkMap,
  vaultsInfo,
  rewardTokenPrices,
  totalRebalancesPerStrategyId,
}: {
  vaultsList?: SDKVaultishType[]
  vaultsApyByNetworkMap?: GetVaultsApyResponse
  vaultsInfo?: IArmadaVaultInfo[]
  rewardTokenPrices?: RewardTokenPrices
  totalRebalancesPerStrategyId?: TotalRebalanceItemsPerStrategyId[]
}) => {
  const smoothScrollToId = (id: string) => {
    const element = document.getElementById(id)

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const heroStats = useMemo(() => {
    const formattedProtocolsSupportedList = getVaultsProtocolsList(vaultsList ?? [])
    const totalRebalances = totalRebalancesPerStrategyId
      ? Object.values(totalRebalancesPerStrategyId).reduce(
          (acc, rebalances) => acc + Number(rebalances.count),
          0,
        )
      : 0

    const rebalanceTimeSavedInHours = getRebalanceSavedTimeInHours(totalRebalances)

    const maxApy =
      (vaultsList
        ? vaultsList.map((vault) => {
            const vaultInfo = findVaultInfo(vaultsInfo, vault)
            const managementFee = getManagementFee(vault.inputToken.symbol)

            if (!vaultInfo) return 0
            if (!vaultsApyByNetworkMap) return 0

            const vaultApy =
              vaultsApyByNetworkMap[
                `${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`
              ]

            const { totalAnnualRewardsPerToken } = getRewardsTokenBonus({
              merklRewards: vaultInfo.merklRewards,
              tokensPriceMap: rewardTokenPrices,
              totalValueLockedUSD: vault.totalValueLockedUSD,
            })
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            const grossRewardsTokenBonus = totalAnnualRewardsPerToken
              ? Object.values(totalAnnualRewardsPerToken).reduce((acc, bonus) => acc + bonus, 0)
              : 0
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            const grossApy = (vaultApy.apy ?? 0) + grossRewardsTokenBonus
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            const netApy = grossApy - (managementFee ?? 0)

            return netApy
          })
        : []
      ).sort((a, b) => b - a)[0] ?? 0

    return [
      {
        label: 'Total Rebalances',
        value: totalRebalances ? (
          Number(totalRebalances).toLocaleString('en-US', { maximumFractionDigits: 0 })
        ) : (
          <SkeletonLine height={30} width={70} style={{ margin: '5px 0' }} />
        ),
      },
      {
        label: 'Hours of user time saved',
        value: rebalanceTimeSavedInHours ? (
          rebalanceTimeSavedInHours.toLocaleString('en-US', { maximumFractionDigits: 1 })
        ) : (
          <SkeletonLine height={30} width={70} style={{ margin: '5px 0' }} />
        ),
      },
      {
        label: 'Markets Optimized',
        value: vaultsList ? (
          formattedProtocolsSupportedList.allVaultsProtocols.length
        ) : (
          <SkeletonLine height={30} width={70} style={{ margin: '5px 0' }} />
        ),
      },
      {
        label: 'Max APY',
        value: maxApy ? (
          formatDecimalAsPercent(maxApy, { precision: 2 })
        ) : (
          <SkeletonLine height={30} width={70} style={{ margin: '5px 0' }} />
        ),
      },
    ]
  }, [
    vaultsList,
    totalRebalancesPerStrategyId,
    vaultsInfo,
    vaultsApyByNetworkMap,
    rewardTokenPrices,
  ])

  const handleGetStartedClick = () => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-get-started`,
      page: '/',
    })
  }

  const handleViewProductsClick = () => {
    smoothScrollToId('our-products')
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
          <Button
            variant="secondarySmall"
            className={landingPageHeroStyles.primaryCta}
            onClick={() => handleViewProductsClick()}
          >
            View&nbsp;Products
          </Button>
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
