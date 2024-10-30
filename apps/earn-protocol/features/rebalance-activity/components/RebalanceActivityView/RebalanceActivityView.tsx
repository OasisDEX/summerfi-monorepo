'use client'

import { type FC, useMemo, useState } from 'react'
import {
  GenericMultiselect,
  getTwitterShareUrl,
  HeadingWithCards,
  Table,
  TableCarousel,
  type TableSortedColumn,
  useCurrentUrl,
  useQueryParams,
} from '@summerfi/app-earn-ui'
import { type SDKRebalancesType, type SDKVaultsListType } from '@summerfi/app-types'
import { formatFiatBalance, formatShorthandNumber } from '@summerfi/app-utils'

import { rebalancingActivityColumns } from '@/features/rebalance-activity/table/columns'
import { rebalanceActivityFilter } from '@/features/rebalance-activity/table/filters/filters'
import { mapMultiselectOptions } from '@/features/rebalance-activity/table/filters/mappers'
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
  searchParams?: { [key: string]: string[] }
}

export const RebalanceActivityView: FC<RebalanceActivityViewProps> = ({
  vaultsList,
  rebalancesList,
  searchParams,
}) => {
  const { setQueryParams } = useQueryParams()
  const [strategyFilter, setStrategyFilter] = useState<string[]>(searchParams?.strategies ?? [])
  const [tokenFilter, setTokenFilter] = useState<string[]>(searchParams?.tokens ?? [])
  const [protocolFilter, setProtocolFilter] = useState<string[]>(searchParams?.protocols ?? [])
  const [sortConfig, setSortConfig] = useState<TableSortedColumn<string>>()
  const currentUrl = useCurrentUrl()

  const { strategiesOptions, tokensOptions, protocolsOptions } = useMemo(
    () => mapMultiselectOptions(vaultsList),
    [vaultsList],
  )

  const filteredList = useMemo(
    () => rebalanceActivityFilter({ rebalancesList, strategyFilter, tokenFilter, protocolFilter }),
    [rebalancesList, strategyFilter, tokenFilter, protocolFilter],
  )

  const rows = useMemo(
    () => rebalancingActivityMapper(filteredList, sortConfig),
    [filteredList, sortConfig],
  )

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
          options={strategiesOptions}
          label="Strategies"
          onChange={(strategies) => {
            setQueryParams({ strategies })
            setStrategyFilter(strategies)
          }}
          initialValues={strategyFilter}
        />
        <GenericMultiselect
          options={tokensOptions}
          label="Tokens"
          onChange={(tokens) => {
            setQueryParams({ tokens })
            setTokenFilter(tokens)
          }}
          initialValues={tokenFilter}
        />
        <GenericMultiselect
          options={protocolsOptions}
          label="Protocols"
          onChange={(protocols) => {
            setQueryParams({ protocols })
            setProtocolFilter(protocols)
          }}
          initialValues={protocolFilter}
        />
      </div>
      <Table
        rows={rows}
        columns={rebalancingActivityColumns}
        customRow={{
          idx: 3,
          content: <TableCarousel carouselData={carouselData} />,
        }}
        handleSort={(_sortConfig) => setSortConfig(_sortConfig)}
      />
    </div>
  )
}
