'use client'
import { type FC, useEffect, useMemo, useState } from 'react'
import { Card, InlineButtons, Table, Text, useHash } from '@summerfi/app-earn-ui'
import { type InlineButtonOption } from '@summerfi/app-types'

import { MockedLineChart } from '@/components/organisms/Charts/MockedLineChart'
import { individualYieldsColumns } from '@/components/organisms/StrategyDetailsYields/columns'
import {
  historicalYieldOptions,
  individualYieldOptions,
  strategyDetailsYieldOptions,
  type YieldOption,
  yieldsRawData,
} from '@/components/organisms/StrategyDetailsYields/config'
import { individualYieldsMapper } from '@/components/organisms/StrategyDetailsYields/mapper'

export const StrategyDetailsYields: FC = () => {
  const hash = useHash<YieldOption>()

  const [currentOption, setCurrentOption] = useState<InlineButtonOption<string>>(
    historicalYieldOptions[0],
  )
  const [currentYieldOption, setCurrentYieldOption] = useState<InlineButtonOption<string>>(
    strategyDetailsYieldOptions[0],
  )
  const [individualYieldOption, setIndividualYieldOption] = useState<InlineButtonOption<string>>(
    individualYieldOptions[0],
  )
  const rows = useMemo(() => individualYieldsMapper(yieldsRawData), [])

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
        <Text as="p" variant="p2semi" style={{ marginBottom: 'var(--spacing-space-medium)' }}>
          Historical Yields
        </Text>
        <InlineButtons
          options={historicalYieldOptions}
          currentOption={currentOption}
          handleOption={(option) => setCurrentOption(option)}
          style={{
            marginBottom: 'var(--spacing-space-large)',
          }}
          asButtons
          variant="p4semi"
        />
        <MockedLineChart />
        <Text
          as="p"
          variant="p2semi"
          style={{
            marginBottom: 'var(--spacing-space-medium)',
            marginTop: 'var(--spacing-space-large)',
          }}
        >
          Individual Yield Data
        </Text>
        <InlineButtons
          options={individualYieldOptions}
          currentOption={individualYieldOption}
          handleOption={(option) => setIndividualYieldOption(option)}
          style={{
            paddingBottom: 'var(--spacing-space-small)',
            borderBottom: '1px solid var(--earn-protocol-neutral-70)',
          }}
          asUnstyled
          variant="p3semi"
        />
        <Table
          rows={rows}
          columns={individualYieldsColumns}
          // eslint-disable-next-line no-console
          handleSort={(item) => console.log(item)}
        />
      </div>
    </Card>
  )
}
