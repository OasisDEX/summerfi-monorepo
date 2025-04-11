'use client'

import { type Dispatch, type FC, type SetStateAction, useMemo, useState } from 'react'
import { Button, Card, Icon, TabBar, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultishType, type SDKVaultType, type VaultApyData } from '@summerfi/app-types'
import { sdkNetworkToHumanNetwork } from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'

import { type GetInterestRatesReturnType } from '@/app/server-handlers/interest-rates'
import { VaultExposureTable } from '@/features/vault-exposure/components/VaultExposureTable/VaultExposureTable'
import { vaultExposureFilter } from '@/features/vault-exposure/table/filters/filters'

export enum VaultExposureFilterType {
  ALL = 'ALL',
  ALLOCATED = 'ALLOCATED',
  UNALLOCATED = 'UNALLOCATED',
}

interface VaultExposureTableSectionProps {
  allocationType: VaultExposureFilterType
  filteredVault: SDKVaultishType
  vault: SDKVaultishType
  resolvedRowsToDisplay: number
  seeAll: boolean
  setSeeAll: Dispatch<SetStateAction<boolean>>
  arksInterestRates: GetInterestRatesReturnType
  hiddenColumns?: string[]
  vaultApyData: VaultApyData
}

export const VaultExposureTableSection: FC<VaultExposureTableSectionProps> = ({
  allocationType,
  filteredVault,
  vault,
  resolvedRowsToDisplay,
  seeAll,
  setSeeAll,
  arksInterestRates,
  hiddenColumns,
  vaultApyData,
}) => {
  const vaultExposureFiltered = useMemo(
    () => vaultExposureFilter({ vault: vault as SDKVaultType, allocationType }),
    [allocationType, vault],
  )

  return (
    <>
      <VaultExposureTable
        arksInterestRates={arksInterestRates}
        vault={vaultExposureFiltered}
        rowsToDisplay={resolvedRowsToDisplay}
        hiddenColumns={hiddenColumns ?? []}
        vaultApyData={vaultApyData}
      />
      {filteredVault.arks.length > 5 && (
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          <Button
            variant="unstyled"
            onClick={() => setSeeAll((prev) => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--general-space-4)',
              marginTop: 'var(--general-space-16)',
            }}
          >
            <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-primary-100)' }}>
              View {seeAll ? 'less' : 'more'}
            </Text>
            <Icon
              iconName={seeAll ? 'chevron_up' : 'chevron_down'}
              variant="xxs"
              color="var(--earn-protocol-primary-100)"
            />
          </Button>
        </div>
      )}
    </>
  )
}

const rowsToDisplay = 5

interface VaultExposureProps {
  vault: SDKVaultishType
  arksInterestRates: GetInterestRatesReturnType
  vaultApyData: VaultApyData
}

const columnsToHide = ['avgApy30d', 'avgApy1y', 'yearlyLow', 'yearlyHigh']

export const VaultExposure: FC<VaultExposureProps> = ({
  vault,
  arksInterestRates,
  vaultApyData,
}) => {
  const [seeAll, setSeeAll] = useState(false)

  // hard to tell how many arks will be per vault therefore limiting it for now to 20
  const resolvedRowsToDisplay = seeAll ? 20 : rowsToDisplay

  const humanReadableNetwork = capitalize(sdkNetworkToHumanNetwork(vault.protocol.network))

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
