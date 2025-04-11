'use client'

import { type FC, useState } from 'react'
import { TabBar } from '@summerfi/app-earn-ui'
import { type SDKVaultishType, type SDKVaultType, type VaultApyData } from '@summerfi/app-types'

import { type GetInterestRatesReturnType } from '@/app/server-handlers/interest-rates'
import { VaultExposureTableSection } from '@/features/vault-exposure/components/VaultExposure/VaultExposure'
import { vaultExposureFilter } from '@/features/vault-exposure/table/filters/filters'

export enum VaultExposureFilterType {
  ALL = 'ALL',
  ALLOCATED = 'ALLOCATED',
  UNALLOCATED = 'UNALLOCATED',
}

const rowsToDisplay = 5

const hiddenColumns = ['liquidity']

interface VaultDetailsIndividualYieldDataProps {
  vault: SDKVaultishType
  arksInterestRates: GetInterestRatesReturnType
  vaultApyData: VaultApyData
}

export const VaultDetailsIndividualYieldData: FC<VaultDetailsIndividualYieldDataProps> = ({
  vault,
  arksInterestRates,
  vaultApyData,
}) => {
  const [seeAll, setSeeAll] = useState(false)

  // hard to tell how many arks will be per vault therefore limiting it for now to 20
  const resolvedRowsToDisplay = seeAll ? 20 : rowsToDisplay

  const tabs = [
    {
      label: 'All',
      id: VaultExposureFilterType.ALL,
      content: (
        <VaultExposureTableSection
          arksInterestRates={arksInterestRates}
          vault={vault}
          vaultApyData={vaultApyData}
          filteredVault={vaultExposureFilter({
            vault: vault as SDKVaultType,
            allocationType: VaultExposureFilterType.ALL,
          })}
          seeAll={seeAll}
          setSeeAll={setSeeAll}
          resolvedRowsToDisplay={resolvedRowsToDisplay}
          allocationType={VaultExposureFilterType.ALL}
          hiddenColumns={hiddenColumns}
        />
      ),
    },
    {
      label: 'Allocated',
      id: VaultExposureFilterType.ALLOCATED,
      content: (
        <VaultExposureTableSection
          arksInterestRates={arksInterestRates}
          vault={vault}
          vaultApyData={vaultApyData}
          filteredVault={vaultExposureFilter({
            vault: vault as SDKVaultType,
            allocationType: VaultExposureFilterType.ALLOCATED,
          })}
          seeAll={seeAll}
          setSeeAll={setSeeAll}
          resolvedRowsToDisplay={resolvedRowsToDisplay}
          allocationType={VaultExposureFilterType.ALLOCATED}
          hiddenColumns={hiddenColumns}
        />
      ),
    },
    {
      label: 'Unallocated',
      id: VaultExposureFilterType.UNALLOCATED,
      content: (
        <VaultExposureTableSection
          arksInterestRates={arksInterestRates}
          vault={vault}
          vaultApyData={vaultApyData}
          filteredVault={vaultExposureFilter({
            vault: vault as SDKVaultType,
            allocationType: VaultExposureFilterType.UNALLOCATED,
          })}
          seeAll={seeAll}
          setSeeAll={setSeeAll}
          resolvedRowsToDisplay={resolvedRowsToDisplay}
          allocationType={VaultExposureFilterType.UNALLOCATED}
          hiddenColumns={hiddenColumns}
        />
      ),
    },
  ]

  return (
    <TabBar
      tabs={tabs}
      textVariant="p3semi"
      tabHeadersStyle={{ borderBottom: '1px solid var(--earn-protocol-neutral-80)' }}
    />
  )
}
