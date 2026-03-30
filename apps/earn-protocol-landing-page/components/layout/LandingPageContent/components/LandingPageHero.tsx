'use client'
import { useMemo } from 'react'
import {
  Button,
  Emphasis,
  getRewardsTokenBonus,
  getVaultsProtocolsList,
  Text,
} from '@summerfi/app-earn-ui'
import {
  type GetVaultsApyResponse,
  type IArmadaVaultInfo,
  type RewardTokenPrices,
  type SDKVaultishType,
} from '@summerfi/app-types'
import {
  findVaultInfo,
  formatCryptoBalance,
  formatDecimalAsPercent,
  subgraphNetworkToId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import Link from 'next/link'

import { EarnProtocolEvents } from '@/helpers/mixpanel'

import landingPageHeroStyles from '@/components/layout/LandingPageContent/components/LandingPageHero.module.css'

const getManagementFee = (tokenSymbol: string): number => {
  // check if it has USD in the symbol, if so return 1%, otherwise return 0.3%
  // EURC now also has 0.3% fee, same as ETH
  const isStablecoin = tokenSymbol.includes('USD')

  return isStablecoin ? 0.01 : 0.003
}

export const LandingPageHero = ({
  vaultsList,
  vaultsApyByNetworkMap,
  vaultsInfo,
  rewardTokenPrices,
}: {
  vaultsList?: SDKVaultishType[]
  vaultsApyByNetworkMap?: GetVaultsApyResponse
  vaultsInfo?: IArmadaVaultInfo[]
  rewardTokenPrices?: RewardTokenPrices
}) => {
  const heroStats = useMemo(() => {
    const formattedProtocolsSupportedList = getVaultsProtocolsList(vaultsList ?? [])
    const tvl = vaultsList?.reduce((sum, vault) => sum + Number(vault.totalValueLockedUSD), 0) ?? 0
    const noOfVaults = vaultsList?.length ?? 0

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
        label: 'TVL',
        value: tvl ? formatCryptoBalance(tvl) : '-',
      },
      {
        label: '# of Vaults',
        value: noOfVaults ? noOfVaults.toLocaleString('en', { maximumFractionDigits: 0 }) : '-',
      },
      {
        label: 'Markets Optimized',
        value: formattedProtocolsSupportedList.allVaultsProtocols.length,
      },
      { label: 'Max APY', value: formatDecimalAsPercent(maxApy, { precision: 2 }) },
    ]
  }, [rewardTokenPrices, vaultsApyByNetworkMap, vaultsInfo, vaultsList])

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
