import { type Dispatch, type FC, type SetStateAction, useMemo, useState } from 'react'
import { Button, Card, Table, Text } from '@summerfi/app-earn-ui'
import { type TokenSymbolsList } from '@summerfi/app-types'
import { capitalize } from 'lodash-es'

import { strategyExposureColumns } from '@/components/organisms/StrategyExposure/columns'
import { strategyExposureMapper } from '@/components/organisms/StrategyExposure/mapper'

enum StrategyExposureFilterType {
  ALL = 'ALL',
  ALLOCATED = 'ALLOCATED',
  UNALLOCATED = 'UNALLOCATED',
}

interface StrategyExposureTypePickerProps {
  currentType: StrategyExposureFilterType
  setExposureType: Dispatch<SetStateAction<StrategyExposureFilterType>>
}

const StrategyExposureTypePicker: FC<StrategyExposureTypePickerProps> = ({
  currentType,
  setExposureType,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--spacing-space-small)',
        justifyContent: 'flex-start',
        width: '100%',
        marginBottom: 'var(--spacing-space-small)',
      }}
    >
      {[
        StrategyExposureFilterType.ALL,
        StrategyExposureFilterType.ALLOCATED,
        StrategyExposureFilterType.UNALLOCATED,
      ].map((itemType) => (
        <Button
          key={itemType}
          variant={itemType === currentType ? 'primarySmall' : 'unstyled'}
          style={{ height: '31px', padding: '0px 16px' }}
          onClick={() => setExposureType(itemType)}
        >
          <Text
            as="span"
            variant="p4semi"
            style={{
              color:
                itemType === currentType
                  ? 'var(--earn-protocol-secondary-100)'
                  : 'var(--earn-protocol-secondary-60)',
            }}
          >
            {capitalize(itemType.toLowerCase())}
          </Text>
        </Button>
      ))}
    </div>
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
        <Table rows={rows} columns={strategyExposureColumns} />
      </div>
    </Card>
  )
}
