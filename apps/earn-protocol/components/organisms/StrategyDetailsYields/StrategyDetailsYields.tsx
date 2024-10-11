'use client'
import { type FC, useMemo, useState } from 'react'
import { Card, InlineButtons, SkeletonImage, Table, Text } from '@summerfi/app-earn-ui'
import { type InlineButtonOption } from '@summerfi/app-types'

import { individualYieldsColumns } from '@/components/organisms/StrategyDetailsYields/columns'
import {
  individualYieldsMapper,
  type IndividualYieldsRawData,
} from '@/components/organisms/StrategyDetailsYields/mapper'

const yieldOptions: InlineButtonOption<string>[] = [
  {
    title: 'Advanced yield',
    key: 'advanced-yield',
  },
  {
    title: 'Yield source',
    key: 'yield-source',
  },
]

const options: InlineButtonOption<string>[] = [
  {
    title: 'All',
    key: 'all',
  },
  {
    title: 'Summer.fi',
    key: 'summerfi',
  },
  {
    title: 'Pendle',
    key: 'pendle',
  },
  {
    title: 'AAVE v3',
    key: 'aavev3',
  },
  {
    title: 'MetaMorpho',
    key: 'metamorpho',
  },
  {
    title: 'Uni V3',
    key: 'univ3',
  },
  {
    title: 'DeFi Median',
    key: 'defimedian',
  },
  {
    title: 'Strategy A',
    key: 'strategya',
  },
  {
    title: 'Strategy B',
    key: 'strategyb',
  },
  {
    title: 'Strategy C',
    key: 'strategyc',
  },
  {
    title: 'Strategy D',
    key: 'strategyd',
  },
  {
    title: 'Strategy E',
    key: 'strategye',
  },
]

enum StrategyExposureFilterType {
  ALL = 'ALL',
  ALLOCATED = 'ALLOCATED',
  UNALLOCATED = 'UNALLOCATED',
}

const individualYieldOptions = [
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

interface StrategyDetailsYieldsProps {
  rawData: IndividualYieldsRawData[]
}

export const StrategyDetailsYields: FC<StrategyDetailsYieldsProps> = ({ rawData }) => {
  const [currentOption, setCurrentOption] = useState<InlineButtonOption<string>>(options[0])
  const [currentYieldOption, setCurrentYieldOption] = useState<InlineButtonOption<string>>(
    yieldOptions[0],
  )
  const [individualYieldOption, setIndividualYieldOption] = useState<InlineButtonOption<string>>(
    individualYieldOptions[0],
  )
  const rows = useMemo(() => individualYieldsMapper(rawData), [rawData])

  return (
    <Card variant="cardPrimary">
      <div
        id="advanced-yield-data"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <InlineButtons
          options={yieldOptions}
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
          options={options}
          currentOption={currentOption}
          handleOption={(option) => setCurrentOption(option)}
          style={{
            marginBottom: 'var(--spacing-space-large)',
          }}
          asButtons
          variant="p4semi"
        />
        <SkeletonImage
          src="/img/rebalancing/rebalancing-morpho.png"
          alt="rebalancing-morpho"
          sizes="100vw"
          style={{
            width: '100%',
            height: 'auto',
          }}
          width={1200}
          height={463}
        />
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
