'use client'

import { type FC, useState } from 'react'
import {
  TabBar,
  useMobileCheck,
  vaultExposureFilter,
  VaultExposureTableSection,
} from '@summerfi/app-earn-ui'
import {
  type InterestRates,
  type SDKVaultishType,
  type SDKVaultType,
  type VaultApyData,
} from '@summerfi/app-types'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'

enum VaultExposureFilterType {
  ALL = 'ALL',
  ALLOCATED = 'ALLOCATED',
  UNALLOCATED = 'UNALLOCATED',
}

const rowsToDisplay = 5

const hiddenColumns = ['liquidity']

interface VaultDetailsIndividualYieldDataProps {
  vault: SDKVaultishType
  arksInterestRates: InterestRates
  vaultApyData: VaultApyData
}

export const VaultDetailsIndividualYieldData: FC<VaultDetailsIndividualYieldDataProps> = ({
  vault,
  arksInterestRates,
  vaultApyData,
}) => {
  const [seeAll, setSeeAll] = useState(false)
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

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
          isMobile={isMobile}
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
          isMobile={isMobile}
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
          isMobile={isMobile}
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
