import { useMemo, useState } from 'react'
import { getRewardsTokenBonus, Text } from '@summerfi/app-earn-ui'
import {
  type GetVaultsApyResponse,
  type IArmadaVaultInfo,
  type RewardTokenPrices,
  type SDKVaultishType,
} from '@summerfi/app-types'
import { findVaultInfo, subgraphNetworkToId, supportedSDKNetwork } from '@summerfi/app-utils'

import { OurProductsList } from '@/components/layout/LandingPageContent/components/OurProductsList'
import { getManagementFee } from '@/helpers/get-management-fee'

import tabStyles from '@/components/layout/LandingPageContent/components/OurProductsTabs.module.css'

const tabs = [
  { id: 'all-products', label: 'All Products' },
  { id: 'permissionless-defi-vaults', label: 'Permissionless DeFi Vaults' },
  { id: 'permissioned-rwa-vaults', label: 'Permissioned RWA Vaults' },
  { id: 'build-your-own-defi-vault', label: 'Build your own DeFi Vault' },
  { id: 'integrate-high-quality-defi-yield', label: 'Integrate high quality DeFi yield' },
]

const OurProductsTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string
  setActiveTab: (tabId: string) => void
}) => {
  return (
    <div className={tabStyles.tabsWrapper}>
      <div className={tabStyles.tabsList}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${tabStyles.tabButton} ${activeTab === tab.id ? tabStyles.tabButtonActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
            aria-pressed={activeTab === tab.id}
          >
            <Text as="span" variant="p3semi" style={{ color: 'inherit' }}>
              {tab.label}
            </Text>
          </button>
        ))}
      </div>
    </div>
  )
}

export const OurProducts = ({
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
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const ourProductsStats = useMemo(() => {
    const maxApyRegularVault =
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

    return {
      maxApyRegularVault,
    }
  }, [rewardTokenPrices, vaultsApyByNetworkMap, vaultsInfo, vaultsList])

  return (
    <>
      <Text
        variant="h3"
        style={{
          marginTop: 'var(--spacing-space-3x-large)',
        }}
        id="our-products"
      >
        Our products
      </Text>
      <Text
        variant="p1"
        style={{
          marginBottom: 'var(--spacing-space-large)',
          color: 'var(--color-text-secondary)',
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        Capture optimized yield, unlock RWA private markets, and launch custom vaults - backed by
        institutional-grade risk and infrastructure
      </Text>
      <OurProductsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <OurProductsList ourProductsStats={ourProductsStats} activeTab={activeTab} />
    </>
  )
}
