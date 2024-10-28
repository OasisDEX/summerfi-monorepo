'use client'

import { type Dispatch, type FC, type SetStateAction, useMemo, useState } from 'react'
import { Card, InlineButtons, Table, Text } from '@summerfi/app-earn-ui'
import { type TokenSymbolsList } from '@summerfi/app-types'

import { vaultExposureColumns } from '@/components/organisms/VaultExposure/columns'
import { vaultExposureMapper } from '@/components/organisms/VaultExposure/mapper'

enum VaultExposureFilterType {
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

export interface VaultExposureRawData {
  vault: {
    label: string
    primaryToken: TokenSymbolsList
    secondaryToken: TokenSymbolsList
  }
  allocation: string
  currentApy: string
  liquidity: string
  type: string
}

interface VaultExposureProps {
  rawData: VaultExposureRawData[]
}

export const VaultExposure: FC<VaultExposureProps> = ({ rawData }) => {
  const rows = useMemo(() => vaultExposureMapper(rawData), [rawData])

  const [exposureType, setExposureType] = useState<VaultExposureFilterType>(
    VaultExposureFilterType.ALL,
  )

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
        <Table
          rows={rows}
          columns={vaultExposureColumns}
          // eslint-disable-next-line no-console
          handleSort={(item) => console.log(item)}
        />
      </div>
    </Card>
  )
}
