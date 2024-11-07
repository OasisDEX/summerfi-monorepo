'use client'
import { type FC, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import {
  GenericMultiselect,
  getTwitterShareUrl,
  HeadingWithCards,
  TableCarousel,
  useCurrentUrl,
  useMobileCheck,
  useQueryParams,
} from '@summerfi/app-earn-ui'
import { type SDKGlobalRebalancesType, type SDKVaultsListType } from '@summerfi/app-types'

import { RebalanceActivityTable } from '@/features/rebalance-activity/components/RebalanceActivityTable/RebalanceActivityTable'
import {
  getRebalanceActivityHeadingCards,
  rebalanceActivityHeading,
} from '@/features/rebalance-activity/components/RebalanceActivityView/cards'
import { rebalanceActivityTableCarouselData } from '@/features/rebalance-activity/components/RebalanceActivityView/carousel'
import { getRebalanceSavedGasCost } from '@/features/rebalance-activity/helpers/get-saved-gas-cost'
import { getRebalanceSavedTimeInHours } from '@/features/rebalance-activity/helpers/get-saved-time-in-hours'
import { rebalanceActivityFilter } from '@/features/rebalance-activity/table/filters/filters'
import { mapMultiselectOptions } from '@/features/rebalance-activity/table/filters/mappers'

import classNames from './RebalanceActivityView.module.scss'

interface RebalanceActivityViewProps {
  vaultsList: SDKVaultsListType
  rebalancesList: SDKGlobalRebalancesType
  searchParams?: { [key: string]: string[] }
}

const initialRows = 10

export const RebalanceActivityView: FC<RebalanceActivityViewProps> = ({
  vaultsList,
  rebalancesList,
  searchParams,
}) => {
  const { setQueryParams } = useQueryParams()
  const [strategyFilter, setStrategyFilter] = useState<string[]>(searchParams?.strategies ?? [])
  const [tokenFilter, setTokenFilter] = useState<string[]>(searchParams?.tokens ?? [])
  const [protocolFilter, setProtocolFilter] = useState<string[]>(searchParams?.protocols ?? [])
  const currentUrl = useCurrentUrl()
  const { isMobile } = useMobileCheck()

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
  const savedTimeInHours = useMemo(() => getRebalanceSavedTimeInHours(totalItems), [totalItems])
  const savedGasCost = useMemo(() => getRebalanceSavedGasCost(totalItems), [totalItems])

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
            style={{ width: isMobile ? '100%' : 'fit-content' }}
          />
        ))}
      </div>
      <InfiniteScroll loadMore={handleMoreItems} hasMore={totalItems > currentlyLoadedList.length}>
        <RebalanceActivityTable
          rebalancesList={filteredList}
          customRow={{
            idx: 3,
            content: <TableCarousel carouselData={rebalanceActivityTableCarouselData} />,
          }}
        />
      </InfiniteScroll>
    </div>
  )
}
