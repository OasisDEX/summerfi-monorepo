'use client'
import { type FC, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
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

import {
  getRebalanceActivityHeadingCards,
  rebalanceActivityHeading,
} from '@/features/rebalance-activity/components/RebalanceActivityView/cards'
import { rebalanceActivityTableCarouselData } from '@/features/rebalance-activity/components/RebalanceActivityView/carousel'
import { rebalancingActivityColumns } from '@/features/rebalance-activity/table/columns'
import { rebalanceActivityFilter } from '@/features/rebalance-activity/table/filters/filters'
import { mapMultiselectOptions } from '@/features/rebalance-activity/table/filters/mappers'
import { rebalancingActivityMapper } from '@/features/rebalance-activity/table/mapper'

import classNames from './RebalanceActivityView.module.scss'

interface RebalanceActivityViewProps {
  vaultsList: SDKVaultsListType
  rebalancesList: SDKRebalancesType
  searchParams?: { [key: string]: string[] }
}

const initialRows = 6

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

  const [current, setCurrent] = useState(initialRows)

  const [currentlyLoadedList, setCurrentlyLoadedList] = useState(
    rebalancesList.slice(0, initialRows),
  )

  const { strategiesOptions, tokensOptions, protocolsOptions } = useMemo(
    () => mapMultiselectOptions(vaultsList),
    [vaultsList],
  )

  const handleMoreItems = () => {
    setCurrentlyLoadedList((prev) => [
      ...prev,
      ...rebalancesList.slice(current, current + initialRows),
    ])
    setCurrent(current + initialRows)
  }

  const filteredList = useMemo(
    () =>
      rebalanceActivityFilter({
        rebalancesList: currentlyLoadedList,
        strategyFilter,
        tokenFilter,
        protocolFilter,
      }),
    [currentlyLoadedList, strategyFilter, tokenFilter, protocolFilter],
  )

  const rows = useMemo(
    () => rebalancingActivityMapper(filteredList, sortConfig),
    [filteredList, sortConfig],
  )

  const genericMultiSelectFilters = [
    {
      options: strategiesOptions,
      label: 'Strategies',
      onChange: (strategies: string[]) => {
        setQueryParams({ strategies })
        setStrategyFilter(strategies)
      },
      initialValues: strategyFilter,
    },
    {
      options: tokensOptions,
      label: 'Tokens',
      onChange: (tokens: string[]) => {
        setQueryParams({ tokens })
        setTokenFilter(tokens)
      },
      initialValues: tokenFilter,
    },
    {
      options: protocolsOptions,
      label: 'Protocols',
      onChange: (protocols: string[]) => {
        setQueryParams({ protocols })
        setProtocolFilter(protocols)
      },
      initialValues: protocolFilter,
    },
  ]

  const totalItems = rebalancesList.length

  // used 3 min as average rebalance action
  const savedTimeInHours = useMemo(() => (totalItems * 3) / 60, [totalItems])

  // used 0.5$ per each rebalance action
  const savedGasCost = useMemo(() => totalItems * 0.5, [totalItems])

  const cards = useMemo(
    () => getRebalanceActivityHeadingCards({ totalItems, savedGasCost, savedTimeInHours }),
    [totalItems, savedGasCost, savedTimeInHours],
  )

  return (
    <div className={classNames.wrapper}>
      <HeadingWithCards
        title={rebalanceActivityHeading.title}
        description={rebalanceActivityHeading.description}
        cards={cards}
        social={{
          linkToCopy: currentUrl,
          linkToShare: getTwitterShareUrl({
            url: currentUrl,
            text: 'Check out Lazy Summer Global Rebalance Activity!',
          }),
        }}
      />
      <div className={classNames.filtersWrapper}>
        {genericMultiSelectFilters.map((filter) => (
          <GenericMultiselect
            key={filter.label}
            options={filter.options}
            label={filter.label}
            onChange={filter.onChange}
            initialValues={filter.initialValues}
          />
        ))}
      </div>
      <InfiniteScroll loadMore={handleMoreItems} hasMore={totalItems > currentlyLoadedList.length}>
        <Table
          rows={rows}
          columns={rebalancingActivityColumns}
          customRow={{
            idx: 3,
            content: <TableCarousel carouselData={rebalanceActivityTableCarouselData} />,
          }}
          handleSort={(_sortConfig) => setSortConfig(_sortConfig)}
        />
      </InfiniteScroll>
    </div>
  )
}
