'use client'
import { type FC, useEffect, useState } from 'react'
import { Card, InlineButtons, Text, useHash } from '@summerfi/app-earn-ui'
import { type InlineButtonOption } from '@summerfi/app-types'

import { StrategyDetailsAdvancedYield } from '@/features/strategy-details/components/StrategyDetailsAdvancedYield/StrategyDetailsAdvancedYield'
import {
  strategyDetailsYieldOptions,
  YieldOption,
} from '@/features/strategy-details/components/StrategyDetailsYields/config'
import { StrategyDetailsYieldSources } from '@/features/strategy-details/components/StrategyDetailsYieldSources/StrategyDetailsYieldSources'

export const StrategyDetailsYields: FC = () => {
  const hash = useHash<YieldOption>()

  const [currentYieldOption, setCurrentYieldOption] = useState<InlineButtonOption<string>>(
    strategyDetailsYieldOptions[0],
  )

  useEffect(() => {
    setCurrentYieldOption(
      strategyDetailsYieldOptions.find((item) => item.key === hash) ??
        strategyDetailsYieldOptions[0],
    )
  }, [hash])

  return (
    <Card variant="cardPrimary">
      <div id="advanced-yield-data" />
      <div id="yield-sources" />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <InlineButtons
          options={strategyDetailsYieldOptions}
          currentOption={currentYieldOption}
          handleOption={(option) => setCurrentYieldOption(option)}
          style={{
            marginBottom: 'var(--spacing-space-large)',
          }}
          asUnstyled
          variant="h5"
        />
        <Text
          as="p"
          variant="p2"
          style={{
            marginBottom: 'var(--spacing-space-x-large)',
            color: 'var(--earn-protocol-secondary-60)',
          }}
        >
          The Summer Earn Protocol is a permissionless passive lending product, which sets out to
          offer effortless and secure optimised yield, while diversifying risk.
        </Text>
        {currentYieldOption.key === YieldOption.ADVANCED_YIELD && <StrategyDetailsAdvancedYield />}
        {currentYieldOption.key === YieldOption.YIELD_SOURCES && <StrategyDetailsYieldSources />}
      </div>
    </Card>
  )
}
