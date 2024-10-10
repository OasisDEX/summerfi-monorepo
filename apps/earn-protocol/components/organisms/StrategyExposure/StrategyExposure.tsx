import { type FC, Fragment, useMemo } from 'react'
import { Card, Icon, Table, TableCellText, Text, TokensGroup, Tooltip } from '@summerfi/app-earn-ui'
import { type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance, formatDecimalAsPercent } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

const strategyTypeTooltipContent = [
  { title: 'Isolated Lending', description: 'Text for what isolated lending is' },
  { title: 'Basic Trading', description: 'Text for what isolated lending is' },
  { title: 'Fixed Yield', description: 'Text for what isolated lending is' },
  { title: 'Lending', description: 'Text for what isolated lending is' },
]

const columns = [
  {
    title: 'Strategy',
    key: 'strategy',
    sortable: false,
  },
  {
    title: '% Allocation',
    key: 'allocation',
    sortable: false,
  },
  {
    title: 'Current APY',
    key: 'currentApy',
    sortable: false,
  },
  {
    title: 'Liquidity',
    key: 'liquidity',
    sortable: false,
  },
  {
    title: (
      <Tooltip
        tooltipWrapperStyles={{ minWidth: '261px' }}
        tooltip={
          <div style={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}>
            {strategyTypeTooltipContent.map((item, idx) => (
              <Fragment key={item.title}>
                <Text
                  as="p"
                  variant="p3semi"
                  style={{
                    color: 'var(--earn-protocol-secondary-100)',
                    marginBottom: 'var(--spacing-space-2x-small)',
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  as="p"
                  variant="p3"
                  style={{
                    color: 'var(--earn-protocol-secondary-60)',
                    marginBottom:
                      strategyTypeTooltipContent.length - 1 === idx
                        ? '0'
                        : 'var(--spacing-space-large)',
                  }}
                >
                  {item.description}
                </Text>
              </Fragment>
            ))}
          </div>
        }
      >
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-space-2x-small)' }}
        >
          Type <Icon iconName="question_o" color="rgba(119, 117, 118, 1)" variant="xs" />
        </div>
      </Tooltip>
    ),
    key: 'type',
    sortable: false,
  },
]

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

const strategyExposureMapper = (rawData: StrategyExposureRawData[]) => {
  return rawData.map((item) => {
    return {
      content: {
        strategy: (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-space-x-small)' }}
          >
            <TokensGroup
              tokens={[item.strategy.primaryToken, item.strategy.secondaryToken]}
              variant="s"
            />
            <TableCellText>{item.strategy.label}</TableCellText>
          </div>
        ),
        allocation: (
          <TableCellText>{formatDecimalAsPercent(new BigNumber(item.allocation))}</TableCellText>
        ),
        currentApy: (
          <TableCellText>{formatDecimalAsPercent(new BigNumber(item.currentApy))}</TableCellText>
        ),
        liquidity: (
          <TableCellText>{formatCryptoBalance(new BigNumber(item.liquidity))}</TableCellText>
        ),
        type: <TableCellText>{item.type}</TableCellText>,
      },
    }
  })
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

        <Table rows={rows} columns={columns} />
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
