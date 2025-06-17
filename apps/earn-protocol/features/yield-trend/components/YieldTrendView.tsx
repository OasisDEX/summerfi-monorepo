'use client'

import { useState } from 'react'
import {
  getDisplayToken,
  getTwitterShareUrl,
  HeadingWithCards,
  useCurrentUrl,
} from '@summerfi/app-earn-ui'
import {
  type ArksHistoricalChartData,
  type GetVaultsApyResponse,
  type SDKVaultishType,
} from '@summerfi/app-types'
import { subgraphNetworkToId } from '@summerfi/app-utils'
import { useRouter } from 'next/navigation'

import { YieldTrendDataCard } from '@/features/yield-trend/components/YieldTrendDataCard'

import { YieldTrendSimulationCard } from './YieldTrendSimulationCard'

import yieldTrendViewStyles from './YieldTrendView.module.css'

type YieldTrendViewProps = {
  vaults: SDKVaultishType[]
  selectedVault: SDKVaultishType
  vaultsApyByNetworkMap: GetVaultsApyResponse
  arksHistoricalChartData: ArksHistoricalChartData
}

export const YieldTrendView = ({
  vaults,
  vaultsApyByNetworkMap,
  selectedVault,
  arksHistoricalChartData,
}: YieldTrendViewProps) => {
  const currentUrl = useCurrentUrl()
  const { push } = useRouter()

  const [tempSelectedVault, setTempSelectedVault] = useState<SDKVaultishType | null>(null)

  const medianDefiApy = 0.0331 // 4.31%
  const medianDefiApy7d = 0.0322 // 3.22%
  const medianDefiApy30d = 0.0391 // 3.91%

  // After the user selects a vault, we want to keep the selected vault in the state
  // until the page refreshes the data (server calls), this is to let the numbers animate
  // This value is passed down to the graph to let the spinner animate
  const selectedVaultLocal = tempSelectedVault ?? selectedVault

  const selectedVaultNetworkId = subgraphNetworkToId(selectedVaultLocal.protocol.network)
  const selectedVaultApy =
    vaultsApyByNetworkMap[`${selectedVaultLocal.id}-${selectedVaultNetworkId}`]

  const selectedVaultToken = getDisplayToken(selectedVaultLocal.inputToken.symbol, {
    swapUSDT: true,
  })
  const selectedVaultTokenPriceUSD = selectedVaultLocal.inputTokenPriceUSD
  const selectedVaultTokenDecimals = selectedVaultLocal.inputToken.decimals

  const setSelectedVault = (vault: SDKVaultishType) => {
    setTempSelectedVault(vault)
    if (vault.id !== selectedVault.id) {
      push(`/yield-trend/${vault.id}-${subgraphNetworkToId(vault.protocol.network)}`, {
        scroll: false,
      })
    }
  }

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
          selectedVault={selectedVaultLocal}
          selectedVaultApy={selectedVaultApy}
          selectedVaultToken={selectedVaultToken}
          selectedVaultTokenDecimals={selectedVaultTokenDecimals}
          selectedVaultTokenPriceUSD={selectedVaultTokenPriceUSD}
          medianDefiApy={medianDefiApy}
          medianDefiApy7d={medianDefiApy7d}
          medianDefiApy30d={medianDefiApy30d}
          setSelectedVault={setSelectedVault}
        />
        <YieldTrendDataCard
          selectedVault={selectedVaultLocal}
          arksHistoricalChartData={arksHistoricalChartData}
          isLoading={!!tempSelectedVault}
        />
      </div>
    </div>
  )
}
