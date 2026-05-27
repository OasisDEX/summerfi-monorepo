'use client'

import { DataBlock } from '@summerfi/app-earn-ui'
import { formatCryptoBalance } from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'

import vaultsListViewStyles from './VaultsListView.module.css'

type VaultsListMetricsProps = {
  tvl: number
  instantLiquidity: number
  protocolsList: {
    topProtocols: string[]
    allVaultsProtocols: string[]
  }
  onTooltipOpen: (tooltipName: string) => void
}

export const VaultsListMetrics = ({
  tvl,
  instantLiquidity,
  protocolsList,
  onTooltipOpen,
}: VaultsListMetricsProps) => {
  const protocolsSupportedCount = protocolsList.allVaultsProtocols.length

  return (
    <div className={vaultsListViewStyles.topContentGrid}>
      <DataBlock
        title="Protocol TVL"
        titleTooltip="Protocol TVL is the total amount of Assets currently deployed across all of the strategies including institutional deployments."
        size="large"
        value={`$${formatCryptoBalance(tvl)}`}
        tooltipName="vaults-list-protocol-tvl"
        onTooltipOpen={onTooltipOpen}
      />

      <DataBlock
        title="Instant Liquidity"
        titleTooltip={`This is the total amount of assets in USD that is instantly withdrawable from the strategies. There are currently ${protocolsSupportedCount} different protocols or markets supported across all active strategies.`}
        size="large"
        value={`$${formatCryptoBalance(instantLiquidity)}`}
        tooltipName="vaults-list-instant-liquidity"
        onTooltipOpen={onTooltipOpen}
      />
      <DataBlock
        title="Protocols Supported"
        titleTooltip={`Protocols supported: ${Array.from(protocolsList.topProtocols)
          .filter((item) => item !== 'BufferArk')
          .map(capitalize)
          .join(', ')}, and ${
          protocolsList.allVaultsProtocols.length - protocolsList.topProtocols.length
        } more.`}
        size="large"
        value={protocolsSupportedCount}
        tooltipName="vaults-list-protocols-supported"
        onTooltipOpen={onTooltipOpen}
      />
    </div>
  )
}
