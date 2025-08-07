'use client'

import { type FC, useState } from 'react'
import {
  type GetInterestRatesParams,
  type SDKVaultishType,
  type SDKVaultType,
  type VaultApyData,
} from '@summerfi/app-types'
import { sdkNetworkToHumanNetwork, supportedSDKNetwork } from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'

import { Card } from '@/components/atoms/Card/Card'
import { Text } from '@/components/atoms/Text/Text'
import { TabBar } from '@/components/molecules/TabBar/TabBar'
import { VaultExposureTableSection } from '@/features/vault-exposure/components/VaultExposureTableSection/VaultExposureTableSection'
import { vaultExposureFilter } from '@/features/vault-exposure/table/filters/filters'
import { VaultExposureFilterType } from '@/features/vault-exposure/types'

const rowsToDisplay = 5

interface VaultExposureProps {
  vault: SDKVaultishType
  arksInterestRates: GetInterestRatesParams
  vaultApyData: VaultApyData
  isMobile: boolean
}

const columnsToHide = ['avgApy30d', 'avgApy1y', 'yearlyLow', 'yearlyHigh']

export const VaultExposure: FC<VaultExposureProps> = ({
  vault,
  arksInterestRates,
  vaultApyData,
  isMobile,
}) => {
  const [seeAll, setSeeAll] = useState(false)

  console.log('vault', vault)

  // hard to tell how many arks will be per vault therefore limiting it for now to 20
  const resolvedRowsToDisplay = seeAll ? 20 : rowsToDisplay

  const humanReadableNetwork = capitalize(
    sdkNetworkToHumanNetwork(supportedSDKNetwork(vault.protocol.network)),
  )

  const tabs = [
    {
      label: 'All',
      id: VaultExposureFilterType.ALL,
      content: (
        <VaultExposureTableSection
          isMobile={isMobile}
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
        />
      ),
    },
    {
      label: 'Allocated',
      id: VaultExposureFilterType.ALLOCATED,
      content: (
        <VaultExposureTableSection
          isMobile={isMobile}
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
        />
      ),
    },
    {
      label: 'Unallocated',
      id: VaultExposureFilterType.UNALLOCATED,
      content: (
        <VaultExposureTableSection
          isMobile={isMobile}
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
        />
      ),
    },
  ]

  return (
    <Card style={{ marginTop: 'var(--spacing-space-medium)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Text
          as="p"
          variant="p2"
          style={{
            marginBottom: 'var(--spacing-space-large)',
            color: 'var(--earn-protocol-secondary-60)',
          }}
        >
          This Vault is composed of various DeFi protocols and markets on the {humanReadableNetwork}{' '}
          Network. These are selected and maintained through a rigorous selection process with risk
          exposure managed by BlockAnalitica, an independant risk team. All protocols are vetted for
          security, performance and trustworthy teams.
        </Text>
        <TabBar
          tabs={tabs}
          textVariant="p3semi"
          tabHeadersStyle={{ borderBottom: '1px solid var(--earn-protocol-neutral-80)' }}
        />
      </div>
    </Card>
  )
}
