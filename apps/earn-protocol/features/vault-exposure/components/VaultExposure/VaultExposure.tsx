'use client'

import { type Dispatch, type FC, type SetStateAction, useMemo, useState } from 'react'
import { Button, Card, Icon, InlineButtons, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultType } from '@summerfi/app-types'

import { VaultExposureTable } from '@/features/vault-exposure/components/VaultExposureTable/VaultExposureTable'
import { vaultExposureFilter } from '@/features/vault-exposure/table/filters/filters'

export enum VaultExposureFilterType {
  ALL = 'ALL',
  ALLOCATED = 'ALLOCATED',
  UNALLOCATED = 'UNALLOCATED',
}

const options = [
  {
    title: 'All',
    key: VaultExposureFilterType.ALL,
  },
  {
    title: 'Allocated',
    key: VaultExposureFilterType.ALLOCATED,
  },
  {
    title: 'Unallocated',
    key: VaultExposureFilterType.UNALLOCATED,
  },
]

interface VaultExposureTypePickerProps {
  currentType: VaultExposureFilterType
  setExposureType: Dispatch<SetStateAction<VaultExposureFilterType>>
}

const VaultExposureTypePicker: FC<VaultExposureTypePickerProps> = ({
  currentType,
  setExposureType,
}) => {
  return (
    <InlineButtons
      options={options}
      currentOption={options.find((item) => item.key === currentType) ?? options[0]}
      handleOption={(option) => setExposureType(option.key)}
      style={{ marginBottom: 'var(--spacing-space-small)' }}
      variant="p4semi"
    />
  )
}

const rowsToDisplay = 5

interface VaultExposureProps {
  vault: SDKVaultType
}

export const VaultExposure: FC<VaultExposureProps> = ({ vault }) => {
  const [exposureType, setExposureType] = useState<VaultExposureFilterType>(
    VaultExposureFilterType.ALL,
  )

  const [seeAll, setSeeAll] = useState(false)

  const filteredVault = useMemo(
    () => vaultExposureFilter({ vault, allocationType: exposureType }),
    [vault, exposureType],
  )

  // hard to tell how many arks will be per vault therefore limiting it for now to 10
  const resolvedRowsToDisplay = seeAll ? 10 : rowsToDisplay

  return (
    <Card variant="cardSecondary" style={{ marginTop: 'var(--spacing-space-medium)' }}>
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

        <VaultExposureTypePicker currentType={exposureType} setExposureType={setExposureType} />
        <VaultExposureTable vault={filteredVault} rowsToDisplay={resolvedRowsToDisplay} />
        {filteredVault.arks.length > 5 && (
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
            <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
              View {seeAll ? 'less' : 'more'}
            </Text>
            <Icon
              iconName={seeAll ? 'chevron_up' : 'chevron_down'}
              variant="xxs"
              color="var(--earn-protocol-primary-100)"
            />
          </Button>
        )}
      </div>
    </Card>
  )
}
