'use client'

import { type FC, type ReactNode } from 'react'
import { type SDKVaultishType, type SDKVaultsListType } from '@summerfi/app-types'
import { formatCryptoBalance, formatDecimalAsPercent } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { Box } from '@/components/atoms/Box/Box'
import { Text } from '@/components/atoms/Text/Text'
import { BonusLabel } from '@/components/molecules/BonusLabel/BonusLabel'
import { DataBlock } from '@/components/molecules/DataBlock/DataBlock'
import { Dropdown } from '@/components/molecules/Dropdown/Dropdown'
import { SimpleGrid } from '@/components/molecules/Grid/SimpleGrid'
import { StrategyTitleDropdownContent } from '@/components/molecules/StrategyTitleDropdownContent/StrategyTitleDropdownContent.tsx'
import { StrategyTitleWithRisk } from '@/components/molecules/StrategyTitleWithRisk/StrategyTitleWithRisk'
import { getStrategyUrl } from '@/helpers/get-strategy-url.ts'

import strategyGridPreviewStyles from './StrategyGridPreview.module.scss'

interface StrategyGridPreviewProps {
  strategy: SDKVaultishType
  strategies: SDKVaultsListType
  leftContent: ReactNode
  rightContent: ReactNode
}

export const StrategyGridPreview: FC<StrategyGridPreviewProps> = ({
  strategy,
  strategies,
  leftContent,
  rightContent,
}) => {
  const parsedApr = formatDecimalAsPercent(new BigNumber(strategy.calculatedApr).div(100))
  const parsedTotalValueLockedUSD = formatCryptoBalance(new BigNumber(strategy.totalValueLockedUSD))

  return (
    <>
      <div className={strategyGridPreviewStyles.strategyGridPreviewBreadcrumbsWrapper}>
        <div style={{ display: 'inline-block' }}>
          <Link href="/earn">
            <Text as="span" variant="p3" style={{ color: 'var(--color-text-primary-disabled)' }}>
              Earn / &nbsp;
            </Text>
          </Link>
          <Text as="span" variant="p3" color="white">
            {strategy.id}
          </Text>
        </div>
      </div>
      <div className={strategyGridPreviewStyles.strategyGridPreviewPositionWrapper}>
        <div>
          <div className={strategyGridPreviewStyles.strategyGridPreviewTopLeftWrapper}>
            <Dropdown
              options={strategies.map((item) => ({
                value: item.id,
                content: (
                  <StrategyTitleDropdownContent strategy={item} link={getStrategyUrl(strategy)} />
                ),
              }))}
              dropdownValue={{
                value: strategy.id,
                content: (
                  <StrategyTitleDropdownContent
                    strategy={strategy}
                    link={getStrategyUrl(strategy)}
                  />
                ),
              }}
            >
              <StrategyTitleWithRisk
                symbol={strategy.inputToken.symbol}
                // TODO: fill data
                risk="low"
                networkName={strategy.protocol.network}
              />
            </Dropdown>
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
                value={parsedApr}
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
                value="value"
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
                value={parsedTotalValueLockedUSD}
                // TODO: fill data
                subValue={`231,232,321.01 ${strategy.inputToken.symbol}`}
                subValueSize="small"
              />
            </Box>
          </SimpleGrid>
          <Box className={strategyGridPreviewStyles.leftBlock}>{leftContent}</Box>
        </div>
        <div className={strategyGridPreviewStyles.rightBlockWrapper}>
          <div className={strategyGridPreviewStyles.rightBlock}>{rightContent}</div>
        </div>
      </div>
    </>
  )
}
