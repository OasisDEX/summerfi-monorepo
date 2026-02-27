'use client'
import { type FC } from 'react'
import { Card } from '@summerfi/app-earn-ui'
import {
  type ArksHistoricalChartData,
  type InterestRates,
  type SDKVaultishType,
  type VaultApyData,
} from '@summerfi/app-types'
import { capitalize } from 'lodash-es'

import { VaultDetailsAdvancedYield } from '@/features/vault-details/components/VaultDetailsAdvancedYield/VaultDetailsAdvancedYield'

import { VaultDetailsYieldsHeader } from './VaultDetailsYieldsHeader'

interface VaultDetailsYieldsProps {
  arksHistoricalChartData: ArksHistoricalChartData
  summerVaultName: string
  vault: SDKVaultishType
  arksInterestRates: InterestRates
  vaultApyData: VaultApyData
}

export const VaultDetailsYields: FC<VaultDetailsYieldsProps> = ({
  arksHistoricalChartData,
  summerVaultName,
  vault,
  arksInterestRates,
  vaultApyData,
}) => {
  return (
    <Card variant="cardSecondary">
      <div id="advanced-yield-data" />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <VaultDetailsYieldsHeader
          tokenSymbol={vault.inputToken.symbol}
          risk={capitalize(vault.isDaoManaged ? 'higher' : vault.customFields?.risk ?? 'lower')}
        />
        <VaultDetailsAdvancedYield
          chartData={arksHistoricalChartData}
          summerVaultName={summerVaultName}
          vault={vault}
          arksInterestRates={arksInterestRates}
          vaultApyData={vaultApyData}
        />
      </div>
    </Card>
  )
}
