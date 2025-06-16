'use client'

import { useState } from 'react'
import {
  getDisplayToken,
  getTwitterShareUrl,
  HeadingWithCards,
  useCurrentUrl,
} from '@summerfi/app-earn-ui'
import { type GetVaultsApyResponse, type SDKVaultishType } from '@summerfi/app-types'
import { subgraphNetworkToId } from '@summerfi/app-utils'

import { YieldTrendDataCard } from '@/features/yield-trend/components/YieldTrendDataCard'

import { YieldTrendSimulationCard } from './YieldTrendSimulationCard'

import yieldTrendViewStyles from './YieldTrendView.module.css'

type YieldTrendViewProps = {
  vaults: SDKVaultishType[]
  vaultsApyByNetworkMap: GetVaultsApyResponse
}

export const YieldTrendView = ({ vaults, vaultsApyByNetworkMap }: YieldTrendViewProps) => {
  const currentUrl = useCurrentUrl()

  const medianDefiApy = 0.0331 // 4.31%
  const medianDefiApy7d = 0.0322 // 3.22%
  const medianDefiApy30d = 0.0391 // 3.91%

  const [selectedVault, setSelectedVault] = useState<SDKVaultishType>(() => {
    return vaults[0]
  })

  const selectedVaultNetworkId = subgraphNetworkToId(selectedVault.protocol.network)
  const selectedVaultApy = vaultsApyByNetworkMap[`${selectedVault.id}-${selectedVaultNetworkId}`]

  const selectedVaultToken = getDisplayToken(selectedVault.inputToken.symbol, { swapUSDT: true })
  const selectedVaultTokenPriceUSD = selectedVault.inputTokenPriceUSD
  const selectedVaultTokenDecimals = selectedVault.inputToken.decimals

  return (
    <div className={yieldTrendViewStyles.wrapper}>
      <HeadingWithCards
        title="DeFi Yield"
        social={{
          linkToCopy: currentUrl,
          linkToShare: getTwitterShareUrl({
            url: currentUrl,
            text: 'Check out the latest DeFi yield trends and how Lazy Summer Protocol optimizes yields with AI!',
          }),
        }}
        description="Stop second guessing how much you should be earning on your crypto assets. Quickly see the median DeFi yield on specific assets from  top DeFi protocols, and how they compare to what you can earn by optimizing only the best of DeFi with Lazy Summer Protocol."
      />
      <div className={yieldTrendViewStyles.cardsVerticalWrapper}>
        <YieldTrendSimulationCard
          vaults={vaults}
          selectedVault={selectedVault}
          selectedVaultApy={selectedVaultApy}
          selectedVaultToken={selectedVaultToken}
          selectedVaultTokenDecimals={selectedVaultTokenDecimals}
          selectedVaultTokenPriceUSD={selectedVaultTokenPriceUSD}
          medianDefiApy={medianDefiApy}
          medianDefiApy7d={medianDefiApy7d}
          medianDefiApy30d={medianDefiApy30d}
          setSelectedVault={setSelectedVault}
        />
        <YieldTrendDataCard selectedVault={selectedVault} />
      </div>
    </div>
  )
}
