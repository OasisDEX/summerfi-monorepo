'use client'

import { type ReactNode } from 'react'
import { type NetworkNames, type Risk, type TokenSymbolsList } from '@summerfi/app-types'

import { Box } from '@/components/atoms/Box/Box'
import { Text } from '@/components/atoms/Text/Text'
import { BonusLabel } from '@/components/molecules/BonusLabel/BonusLabel'
import { DataBlock } from '@/components/molecules/DataBlock/DataBlock'
import { SimpleGrid } from '@/components/molecules/Grid/SimpleGrid'
import { StrategyTitleWithRisk } from '@/components/molecules/StrategyTitleWithRisk/StrategyTitleWithRisk'

import strategyGridDetailsStyles from './StrategyGridDetails.module.scss'

export const StrategyGridDetails = ({
  strategy,
  leftContent,
  rightContent,
}: {
  strategy: {
    id: string
    symbol: TokenSymbolsList
    network: NetworkNames
    apy: string
    risk: Risk
  }
  leftContent: ReactNode
  rightContent: ReactNode
}) => {
  return (
    <>
      <div className={strategyGridDetailsStyles.strategyGridDetailsBreadcrumbsWrapper}>
        <div style={{ display: 'inline-block' }}>
          <Text as="span" variant="p3" style={{ color: 'var(--color-text-primary-disabled)' }}>
            Earn / &nbsp;
          </Text>
          <Text as="span" variant="p3" color="white">
            Strategy #{strategy.id} with {strategy.symbol} on {strategy.network}
          </Text>
        </div>
      </div>
      <div className={strategyGridDetailsStyles.strategyGridDetailsPositionWrapper}>
        <div>
          <div className={strategyGridDetailsStyles.strategyGridDetailsTopLeftWrapper}>
            <StrategyTitleWithRisk symbol={strategy.symbol} risk={strategy.risk} />
            <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>
              <BonusLabel rays="1,111" />
            </Text>
          </div>
          <SimpleGrid
            columns={2}
            rows={2}
            gap="var(--general-space-16)"
            style={{ marginBottom: 'var(--general-space-16)' }}
          >
            <Box>
              <DataBlock
                size="large"
                titleSize="small"
                title="30d APY"
                value={`${strategy.apy}%`}
                subValue="+2.1% Median DeFi Yield"
                subValueType="positive"
                subValueSize="small"
              />
            </Box>
            <Box>
              <DataBlock
                size="large"
                titleSize="small"
                title="Current APY"
                value={`${strategy.apy}%`}
                subValue="+1.7% Median DeFi Yield"
                subValueType="positive"
                subValueSize="small"
              />
            </Box>
            <Box
              style={{
                gridColumn: '1/3',
              }}
            >
              <DataBlock
                size="large"
                titleSize="small"
                title="Assets in strategy"
                value="$232m"
                subValue={`231,232,321.01 ${strategy.symbol}`}
                subValueSize="small"
              />
            </Box>
          </SimpleGrid>
          <Box className={strategyGridDetailsStyles.leftBlock}>{leftContent}</Box>
        </div>
        {rightContent}
      </div>
    </>
  )
}
