'use client'

import { type FC, useState } from 'react'
import {
  type InterestRates,
  type SDKVaultishType,
  type SDKVaultType,
  type VaultApyData,
} from '@summerfi/app-types'

import { TabBar } from '@/components/molecules/TabBar/TabBar'
import { VaultExposureTableSection } from '@/features/vault-exposure/components/VaultExposureTableSection/VaultExposureTableSection'
import { vaultExposureFilter } from '@/features/vault-exposure/table/filters/filters'
import { VaultExposureFilterType } from '@/features/vault-exposure/types'

const rowsToDisplay = 5

interface VaultExposureProps {
  vault: SDKVaultishType
  arksInterestRates: InterestRates
  vaultApyData: VaultApyData
  columnsToHide?: string[]
  tableId: string
  tooltipEventHandler: (tooltipName: string) => void
  buttonClickEventHandler: (buttonName: string) => void
}

export const VaultExposure: FC<VaultExposureProps> = ({
  vault,
  arksInterestRates,
  vaultApyData,
  columnsToHide,
  tableId,
  buttonClickEventHandler,
  tooltipEventHandler: _tooltipEventHandler, // to be handled later
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
          vaultApyData={vaultApyData}
          vault={vault}
          filteredVault={vaultExposureFilter({
            vault: vault as SDKVaultType,
            allocationType: VaultExposureFilterType.ALL,
          })}
          seeAll={seeAll}
          setSeeAll={setSeeAll}
          resolvedRowsToDisplay={resolvedRowsToDisplay}
          allocationType={VaultExposureFilterType.ALL}
          hiddenColumns={columnsToHide}
          tableId={tableId}
          buttonClickEventHandler={buttonClickEventHandler}
        />
      ),
    },
    {
      label: 'Allocated',
      id: VaultExposureFilterType.ALLOCATED,
      content: (
        <VaultExposureTableSection
          arksInterestRates={arksInterestRates}
          vaultApyData={vaultApyData}
          vault={vault}
          filteredVault={vaultExposureFilter({
            vault: vault as SDKVaultType,
            allocationType: VaultExposureFilterType.ALLOCATED,
          })}
          seeAll={seeAll}
          setSeeAll={setSeeAll}
          resolvedRowsToDisplay={resolvedRowsToDisplay}
          allocationType={VaultExposureFilterType.ALLOCATED}
          hiddenColumns={columnsToHide}
          tableId={tableId}
          buttonClickEventHandler={buttonClickEventHandler}
        />
      ),
    },
    {
      label: 'Unallocated',
      id: VaultExposureFilterType.UNALLOCATED,
      content: (
        <VaultExposureTableSection
          arksInterestRates={arksInterestRates}
          vaultApyData={vaultApyData}
          vault={vault}
          filteredVault={vaultExposureFilter({
            vault: vault as SDKVaultType,
            allocationType: VaultExposureFilterType.UNALLOCATED,
          })}
          seeAll={seeAll}
          setSeeAll={setSeeAll}
          resolvedRowsToDisplay={resolvedRowsToDisplay}
          allocationType={VaultExposureFilterType.UNALLOCATED}
          hiddenColumns={columnsToHide}
          tableId={tableId}
          buttonClickEventHandler={buttonClickEventHandler}
        />
      ),
    },
  ]

  return (
    <TabBar
      tabs={tabs}
      textVariant="p3semi"
      tabHeadersStyle={{ borderBottom: '1px solid var(--earn-protocol-neutral-80)' }}
      handleTabChange={(tab) => {
        buttonClickEventHandler(`${tableId}-vault-exposure-tab-${tab.id.toLowerCase()}`)
      }}
    />
  )
}
