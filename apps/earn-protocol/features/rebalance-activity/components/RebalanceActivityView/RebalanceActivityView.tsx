'use client'
import { type FC, useMemo } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import {
  GenericMultiselect,
  getTwitterShareUrl,
  HeadingWithCards,
  LoadingSpinner,
  TableCarousel,
  useCurrentUrl,
  useMobileCheck,
  useQueryParams,
} from '@summerfi/app-earn-ui'
import { type SDKVaultsListType } from '@summerfi/app-types'
import { getRebalanceSavedGasCost, getRebalanceSavedTimeInHours } from '@summerfi/app-utils'

import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { useRebalanceActivityInfiniteQuery } from '@/features/rebalance-activity/api/get-rebalance-activity'
import { RebalanceActivityTable } from '@/features/rebalance-activity/components/RebalanceActivityTable/RebalanceActivityTable'
import {
  getRebalanceActivityHeadingCards,
  rebalanceActivityHeading,
} from '@/features/rebalance-activity/components/RebalanceActivityView/cards'
import { rebalanceActivityTableCarouselData } from '@/features/rebalance-activity/components/RebalanceActivityView/carousel'
import { getRebalanceActivityShouldHydrateFromServer } from '@/features/rebalance-activity/helpers/get-should-hydrate-from-server'
import {
  mapMultiselectOptions,
  parseProtocolFilter,
} from '@/features/rebalance-activity/table/filters/mappers'

import classNames from './RebalanceActivityView.module.css'

interface RebalanceActivityViewProps {
  vaultsList: SDKVaultsListType
  rebalanceActivity: RebalanceActivityPagination
  searchParams?: { [key: string]: string[] }
}

export const RebalanceActivityView: FC<RebalanceActivityViewProps> = ({
  vaultsList,
  rebalanceActivity,
  searchParams,
}) => {
  const { setQueryParams, queryParams } = useQueryParams(searchParams)
  const strategyFilter = queryParams.strategies
  const tokenFilter = queryParams.tokens
  const protocolFilter = useMemo(
    () => parseProtocolFilter(queryParams.protocols),
    [queryParams.protocols],
  )

  const currentUrl = useCurrentUrl()
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const { strategiesOptions, tokensOptions, protocolsOptions } = useMemo(
    () => mapMultiselectOptions(vaultsList),
    [vaultsList],
  )

  const shouldHydrateFromServer = getRebalanceActivityShouldHydrateFromServer({
    strategyFilter,
    tokenFilter,
    protocolFilter,
    searchParams,
  })

  const { data, isPending, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useRebalanceActivityInfiniteQuery({
      tokens: tokenFilter,
      strategies: strategyFilter,
      protocols: protocolFilter,
      sortBy: 'timestamp',
      orderBy: 'desc',
      initialData: shouldHydrateFromServer ? rebalanceActivity : undefined,
    })

  const currentlyLoadedList = useMemo(
    () => (data ? data.pages.flatMap((p) => p.data) : rebalanceActivity.data),
    [data, rebalanceActivity.data],
  )

  const { totalItems } = rebalanceActivity.pagination
  const savedTimeInHours = useMemo(() => getRebalanceSavedTimeInHours(totalItems), [totalItems])
  const savedGasCost = useMemo(
    () => getRebalanceSavedGasCost(rebalanceActivity.totalItemsPerStrategyId),
    [rebalanceActivity.totalItemsPerStrategyId],
  )

  const cards = useMemo(
    () => getRebalanceActivityHeadingCards({ totalItems, savedGasCost, savedTimeInHours }),
    [totalItems, savedGasCost, savedTimeInHours],
  )

  const genericMultiSelectFilters = [
    {
      options: strategiesOptions,
      label: 'Strategies',
      onChange: (strategies: string[]) => {
        setQueryParams({ strategies })
      },
      initialValues: strategyFilter,
    },
    {
      options: tokensOptions,
      label: 'Tokens',
      onChange: (tokens: string[]) => {
        setQueryParams({ tokens })
      },
      initialValues: tokenFilter,
    },
    {
      options: protocolsOptions,
      label: 'Protocols',
      onChange: (protocols: string[]) => {
        setQueryParams({ protocols })
      },
      initialValues: protocolFilter,
    },
  ]

  const handleLoadMore = () => {
    if (isFetchingNextPage || !hasNextPage) return
    void fetchNextPage()
  }

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
            text: 'Check out how much time and money has been saved by the Lazy Summer AI Powered Agents keeping the protocol optimized!',
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
      <InfiniteScroll
        loadMore={handleLoadMore}
        hasMore={!!hasNextPage}
        loader={
          isFetchingNextPage ? (
            <LoadingSpinner
              key="spinner"
              style={{ margin: '0 auto', marginTop: 'var(--spacing-space-medium)' }}
            />
          ) : undefined
        }
      >
        <RebalanceActivityTable
          rebalanceActivityList={currentlyLoadedList}
          customRow={{
            idx: 3,
            content: <TableCarousel carouselData={rebalanceActivityTableCarouselData} />,
          }}
          isLoading={isPending}
        />
      </InfiniteScroll>
    </div>
  )
}
