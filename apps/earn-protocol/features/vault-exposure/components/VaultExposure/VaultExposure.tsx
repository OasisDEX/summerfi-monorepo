'use client'

import { type Dispatch, type FC, type SetStateAction, useState } from 'react'
import { Button, Card, Icon, TabBar, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultishType, type SDKVaultType } from '@summerfi/app-types'

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
}

const VaultExposureTableSection: FC<VaultExposureTableSectionProps> = ({
  allocationType,
  filteredVault,
  vault,
  resolvedRowsToDisplay,
  seeAll,
  setSeeAll,
}) => {
  return (
    <>
      <VaultExposureTable
        vault={vaultExposureFilter({
          vault: vault as SDKVaultType,
          allocationType,
        })}
        rowsToDisplay={resolvedRowsToDisplay}
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
}

export const VaultExposure: FC<VaultExposureProps> = ({ vault }) => {
  const [seeAll, setSeeAll] = useState(false)

  // hard to tell how many arks will be per vault therefore limiting it for now to 10
  const resolvedRowsToDisplay = seeAll ? 10 : rowsToDisplay

  const tabs = [
    {
      label: 'All',
      id: VaultExposureFilterType.ALL,
      content: (
        <VaultExposureTableSection
          vault={vault}
          filteredVault={vaultExposureFilter({
            vault: vault as SDKVaultType,
            allocationType: VaultExposureFilterType.ALL,
          })}
          seeAll={seeAll}
          setSeeAll={setSeeAll}
          resolvedRowsToDisplay={resolvedRowsToDisplay}
          allocationType={VaultExposureFilterType.ALL}
        />
      ),
    },
    {
      label: 'Allocated',
      id: VaultExposureFilterType.ALLOCATED,
      content: (
        <VaultExposureTableSection
          vault={vault}
          filteredVault={vaultExposureFilter({
            vault: vault as SDKVaultType,
            allocationType: VaultExposureFilterType.ALLOCATED,
          })}
          seeAll={seeAll}
          setSeeAll={setSeeAll}
          resolvedRowsToDisplay={resolvedRowsToDisplay}
          allocationType={VaultExposureFilterType.ALLOCATED}
        />
      ),
    },
    {
      label: 'Unallocated',
      id: VaultExposureFilterType.UNALLOCATED,
      content: (
        <VaultExposureTableSection
          vault={vault}
          filteredVault={vaultExposureFilter({
            vault: vault as SDKVaultType,
            allocationType: VaultExposureFilterType.UNALLOCATED,
          })}
          seeAll={seeAll}
          setSeeAll={setSeeAll}
          resolvedRowsToDisplay={resolvedRowsToDisplay}
          allocationType={VaultExposureFilterType.UNALLOCATED}
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
          This vault is composed of various DeFi protocols through our rigorous selection process.
          Vetted for security, performance and trustworthy teams.
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
