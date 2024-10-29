'use client'

import { type FC, useMemo, useState } from 'react'
import {
  GenericMultiselect,
  getTwitterShareUrl,
  HeadingWithCards,
  Table,
  TableCarousel,
  useCurrentUrl,
} from '@summerfi/app-earn-ui'
import { type SDKRebalancesType, type SDKVaultsListType } from '@summerfi/app-types'
import { formatFiatBalance, formatShorthandNumber } from '@summerfi/app-utils'

import { rebalanceFilterProtocols } from '@/features/rebalance-activity/filters/filter-protocols'
import { rebalanceFilterStrategies } from '@/features/rebalance-activity/filters/filter-strategies'
import { rebalanceFilterTokens } from '@/features/rebalance-activity/filters/filter-tokens'
import {
  mapProtocolsToMultiselectOptions,
  mapStrategiesToMultiselectOptions,
  mapTokensToMultiselectOptions,
} from '@/features/rebalance-activity/filters/mappers'
import { rebalancingActivityColumns } from '@/features/rebalance-activity/table/columns'
import { rebalancingActivityMapper } from '@/features/rebalance-activity/table/mapper'

import classNames from './RebalanceActivityView.module.scss'

const carouselData = [
  {
    title: 'Reduced costs',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus massa ac sapien eleifend.',
    link: {
      label: 'Add to position',
      href: '/',
    },
  },
  {
    title: 'Optimized Yield',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus massa ac sapien eleifend.',
    link: {
      label: 'Add to position',
      href: '/',
    },
  },
  {
    title: 'Saved Time',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus massa ac sapien eleifend.',
    link: {
      label: 'Add to position',
      href: '/',
    },
  },
]

interface RebalanceActivityViewProps {
  vaultsList: SDKVaultsListType
  rebalancesList: SDKRebalancesType
}

export const RebalanceActivityView: FC<RebalanceActivityViewProps> = ({
  vaultsList,
  rebalancesList,
}) => {
  const [strategyFilter, setStrategyFilter] = useState<string[]>([])
  const [tokenFilter, setTokenFilter] = useState<string[]>([])
  const [protocolFilter, setProtocolFilter] = useState<string[]>([])

  const currentUrl = useCurrentUrl()
  const strategiesMultiselectOptions = mapStrategiesToMultiselectOptions(vaultsList)
  const tokensMultiselectOptions = mapTokensToMultiselectOptions(vaultsList)
  const protocolsMultiselectOptions = mapProtocolsToMultiselectOptions(vaultsList)

  const resolvedList = rebalancesList
    .filter((rebalance) => rebalanceFilterProtocols({ protocolFilter, rebalance }))
    .filter((rebalance) => rebalanceFilterStrategies({ strategyFilter, rebalance }))
    .filter((rebalance) => rebalanceFilterTokens({ tokenFilter, rebalance }))

  const rows = useMemo(() => rebalancingActivityMapper(resolvedList), [resolvedList])

  // used 3 min as average rebalance action
  const savedTimeInHours = (rows.length * 3) / 60

  // used 0.5$ per each rebalance action
  const savedGasCost = rows.length * 0.5

  return (
    <div className={classNames.wrapper}>
      <HeadingWithCards
        title="Lazy Summer Global Rebalance Activity"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia bibendum nulla sed consectetur. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nullam quis risus eget."
        cards={[
          {
            title: 'Rebalance actions',
            value: formatShorthandNumber(rows.length, { precision: 0 }),
            description:
              'Justo enim sollicitudin suspendisse lectus tellus tortor magna. Velit id nulla tempor arcu quis condimentum parturient.',
          },
          {
            title: 'User saved time',
            value: `${formatShorthandNumber(savedTimeInHours, { precision: 1 })} hours`,
            description:
              'Justo enim sollicitudin suspendisse lectus tellus tortor magna. Velit id nulla tempor arcu quis condimentum parturient.',
          },
          {
            title: 'Gas cost savings',
            value: `$${formatFiatBalance(savedGasCost)}`,
            description:
              'Justo enim sollicitudin suspendisse lectus tellus tortor magna. Velit id nulla tempor arcu quis condimentum parturient.',
          },
        ]}
        social={{
          linkToCopy: currentUrl,
          linkToShare: getTwitterShareUrl({
            url: currentUrl,
            text: 'Check out Lazy Summer Global Rebalance Activity!',
          }),
        }}
      />
      <div className={classNames.filtersWrapper}>
        <GenericMultiselect
          options={strategiesMultiselectOptions}
          label="Strategies"
          onChange={(strategies) => setStrategyFilter(strategies)}
        />
        <GenericMultiselect
          options={tokensMultiselectOptions}
          label="Tokens"
          onChange={(tokens) => setTokenFilter(tokens)}
        />
        <GenericMultiselect
          options={protocolsMultiselectOptions}
          label="Protocols"
          onChange={(filters) => setProtocolFilter(filters)}
        />
      </div>
      <Table
        rows={rows}
        columns={rebalancingActivityColumns}
        customRow={{
          idx: 3,
          content: <TableCarousel carouselData={carouselData} />,
        }}
      />
    </div>
  )
}
