'use client'

import { type Dispatch, type FC, type SetStateAction, useMemo, useState } from 'react'
import { Card, InlineButtons, Table, Text } from '@summerfi/app-earn-ui'
import { type TokenSymbolsList } from '@summerfi/app-types'

import { strategyExposureColumns } from '@/components/organisms/StrategyExposure/columns'
import { strategyExposureMapper } from '@/components/organisms/StrategyExposure/mapper'

enum StrategyExposureFilterType {
  ALL = 'ALL',
  ALLOCATED = 'ALLOCATED',
  UNALLOCATED = 'UNALLOCATED',
}

const options = [
  {
    title: 'All',
    key: StrategyExposureFilterType.ALL,
  },
  {
    title: 'Allocated',
    key: StrategyExposureFilterType.ALLOCATED,
  },
  {
    title: 'Unallocated',
    key: StrategyExposureFilterType.UNALLOCATED,
  },
]

interface StrategyExposureTypePickerProps {
  currentType: StrategyExposureFilterType
  setExposureType: Dispatch<SetStateAction<StrategyExposureFilterType>>
}

const StrategyExposureTypePicker: FC<StrategyExposureTypePickerProps> = ({
  currentType,
  setExposureType,
}) => {
  return (
    <InlineButtons
      options={options}
      currentOption={options.find((item) => item.key === currentType) ?? options[0]}
      handleOption={(option) => setExposureType(option.key)}
      style={{ marginBottom: 'var(--spacing-space-small)' }}
    />
  )
}

export interface StrategyExposureRawData {
  strategy: {
    label: string
    primaryToken: TokenSymbolsList
    secondaryToken: TokenSymbolsList
  }
  allocation: string
  currentApy: string
  liquidity: string
  type: string
}

interface StrategyExposureProps {
  rawData: StrategyExposureRawData[]
}

export const StrategyExposure: FC<StrategyExposureProps> = ({ rawData }) => {
  const rows = useMemo(() => strategyExposureMapper(rawData), [rawData])

  const [exposureType, setExposureType] = useState<StrategyExposureFilterType>(
    StrategyExposureFilterType.ALL,
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
          This strategy is composed of various DeFi protocols through our rigorous selection
          process. Vetted for security, performance and trustworthy teams.
        </Text>

        <StrategyExposureTypePicker currentType={exposureType} setExposureType={setExposureType} />
        <Table
          rows={rows}
          columns={strategyExposureColumns}
          // eslint-disable-next-line no-console
          handleSort={(item) => console.log(item)}
        />
      </div>
    </Card>
  )
}
