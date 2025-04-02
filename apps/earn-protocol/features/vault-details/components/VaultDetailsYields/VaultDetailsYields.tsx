'use client'
import { type FC } from 'react'
import { Card, Text } from '@summerfi/app-earn-ui'
import { type ArksHistoricalChartData, type SDKVaultishType } from '@summerfi/app-types'

import { VaultDetailsAdvancedYield } from '@/features/vault-details/components/VaultDetailsAdvancedYield/VaultDetailsAdvancedYield'

interface VaultDetailsYieldsProps {
  arksHistoricalChartData: ArksHistoricalChartData
  summerVaultName: string
  vault: SDKVaultishType
  arksInterestRates: { [key: string]: number }
}

export const VaultDetailsYields: FC<VaultDetailsYieldsProps> = ({
  arksHistoricalChartData,
  summerVaultName,
  vault,
  arksInterestRates,
}) => {
  return (
    <Card variant="cardSecondary">
      <div id="advanced-yield-data" />
      <div id="yield-sources" />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <Text
          as="h5"
          variant="h5"
          style={{
            marginBottom: 'var(--general-space-16)',
          }}
        >
          Historical Yields
        </Text>
        <Text
          as="p"
          variant="p2"
          style={{
            marginBottom: 'var(--spacing-space-x-large)',
            color: 'var(--earn-protocol-secondary-60)',
          }}
        >
          The Summer Earn Protocol is a permissionless passive lending product, which sets out to
          offer effortless and secure optimised yield, while diversifying risk.
        </Text>
        <VaultDetailsAdvancedYield
          chartData={arksHistoricalChartData}
          summerVaultName={summerVaultName}
          vault={vault}
          arksInterestRates={arksInterestRates}
        />
      </div>
    </Card>
  )
}
