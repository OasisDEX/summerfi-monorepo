import { type FC, useMemo } from 'react'
import { Card, Table, Text } from '@summerfi/app-earn-ui'
import { type TokenSymbolsList } from '@summerfi/app-types'

import { strategyExposureColumns } from '@/components/organisms/StrategyExposure/columns'
import { strategyExposureMapper } from '@/components/organisms/StrategyExposure/mapper'

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

        <Table rows={rows} columns={strategyExposureColumns} />
        {rows.length > 5 && (
          <Text
            as="p"
            variant="p4semi"
            style={{
              color: 'var(--earn-protocol-primary-100)',
              marginTop: 'var(--spacing-space-large)',
            }}
          >
            View more
          </Text>
        )}
      </div>
    </Card>
  )
}
