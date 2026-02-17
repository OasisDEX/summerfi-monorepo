'use client'

import { type FC, useState } from 'react'
import {
  type InterestRates,
  type SDKVaultishType,
  type SDKVaultType,
  type VaultApyData,
} from '@summerfi/app-types'

import { TabBar } from '@/components/molecules/TabBar/TabBar'
import { Table } from '@/components/organisms/Table/Table'
import { VaultExposureTableSection } from '@/features/vault-exposure/components/VaultExposureTableSection/VaultExposureTableSection'
import { vaultExposureColumns } from '@/features/vault-exposure/table/columns'
import { vaultExposureFilter } from '@/features/vault-exposure/table/filters/filters'
import { VaultExposureFilterType } from '@/features/vault-exposure/types'

const defaultRowsToDisplay = 5

interface VaultExposureProps {
  vault: SDKVaultishType
  arksInterestRates: InterestRates
  vaultApyData: VaultApyData
  columnsToHide?: string[]
  tableId: string
  buttonClickEventHandler: (buttonName: string) => void
  isDaoManaged?: boolean
}

export const VaultExposure: FC<VaultExposureProps> = ({
  vault,
  arksInterestRates,
  vaultApyData,
  columnsToHide,
  tableId,
  buttonClickEventHandler,
  isDaoManaged = false,
}) => {
  const [seeAll, setSeeAll] = useState(false)

  // hard to tell how many arks will be per vault therefore limiting it for now to 20
  const resolvedRowsToDisplay = seeAll ? Infinity : defaultRowsToDisplay

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
          isDaoManaged={isDaoManaged}
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
          isDaoManaged={isDaoManaged}
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
          isDaoManaged={isDaoManaged}
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

export const VaultExposureLoading: FC = () => {
  const tableElement = (
    <Table
      isLoading
      skeletonLines={5}
      skeletonStyles={{
        margin: '10px 0',
      }}
      rows={[]}
      columns={vaultExposureColumns({
        apyCurrent: '',
        apyUpdatedAt: {
          apyUpdatedAtAltLabel: '',
          apyUpdatedAtLabel: '',
        },
        isAltPressed: false,
      })}
      hiddenColumns={['yearlyLow', 'yearlyHigh', 'avgApy1y']}
    />
  )
  const tabs = [
    {
      label: 'All',
      id: VaultExposureFilterType.ALL,
      content: tableElement,
    },
    {
      label: 'Allocated',
      id: VaultExposureFilterType.ALLOCATED,
      content: tableElement,
    },
    {
      label: 'Unallocated',
      id: VaultExposureFilterType.UNALLOCATED,
      content: tableElement,
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
