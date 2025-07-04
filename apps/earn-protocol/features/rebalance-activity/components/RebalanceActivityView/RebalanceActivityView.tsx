'use client'
import { type FC, useEffect, useMemo, useRef, useState } from 'react'
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
import { getRebalanceActivity } from '@/features/rebalance-activity/api/get-rebalance-activity'
import { RebalanceActivityTable } from '@/features/rebalance-activity/components/RebalanceActivityTable/RebalanceActivityTable'
import {
  getRebalanceActivityHeadingCards,
  rebalanceActivityHeading,
} from '@/features/rebalance-activity/components/RebalanceActivityView/cards'
import { rebalanceActivityTableCarouselData } from '@/features/rebalance-activity/components/RebalanceActivityView/carousel'
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

  const isFirstRender = useRef(true)
  const currentUrl = useCurrentUrl()
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const [hasMoreItems, setHasMoreItems] = useState(true)

  const [currentPage, setCurrentPage] = useState(rebalanceActivity.pagination.currentPage)
  const [isLoading, setIsLoading] = useState(false)
  const [currentlyLoadedList, setCurrentlyLoadedList] = useState(rebalanceActivity.data)

  const { strategiesOptions, tokensOptions, protocolsOptions } = useMemo(
    () => mapMultiselectOptions(vaultsList),
    [vaultsList],
  )

  const handleMoreItems = async () => {
    if (!hasMoreItems || isLoading) return // Add loading check

    try {
      const nextPage = currentPage + 1
      const res = await getRebalanceActivity({
        page: nextPage,
        tokens: tokenFilter,
        strategies: strategyFilter,
        protocols: protocolFilter,
      })

      if (res.data.length === 0 || nextPage >= res.pagination.totalPages) {
        setHasMoreItems(false)
      }
      setCurrentlyLoadedList((prev) => [...prev, ...res.data])
      setCurrentPage((prev) => prev + 1)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching more rebalance activity', error)
      setHasMoreItems(false)
    }
  }

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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false

      return
    }

    setIsLoading(true)
    setHasMoreItems(true)

    getRebalanceActivity({
      page: 1,
      tokens: tokenFilter,
      strategies: strategyFilter,
      protocols: protocolFilter,
      sortBy: 'timestamp',
      orderBy: 'desc',
    })
      .then((res) => {
        setCurrentlyLoadedList(res.data)
        setCurrentPage(1)

        if (res.data.length === 0 || res.pagination.currentPage >= res.pagination.totalPages) {
          setHasMoreItems(false)
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [strategyFilter, tokenFilter, protocolFilter])

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
        loadMore={handleMoreItems}
        hasMore={hasMoreItems}
        loader={
          // inversed, we don't want loading spinner when skeleton is visible
          !isLoading ? (
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
          isLoading={isLoading}
        />
      </InfiniteScroll>
    </div>
  )
}
