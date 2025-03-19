'use client'
import { type FC, useEffect, useMemo, useRef, useState } from 'react'
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
import { mapMultiselectOptions } from '@/features/rebalance-activity/table/filters/mappers'

import classNames from './RebalanceActivityView.module.scss'

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
  const protocolFilter = queryParams.protocols

  const isFirstRender = useRef(true)
  const currentUrl = useCurrentUrl()
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const [currentPage, setCurrentPage] = useState(rebalanceActivity.pagination.currentPage)
  const [isLoading, setIsLoading] = useState(false)
  const [currentlyLoadedList, setCurrentlyLoadedList] = useState(rebalanceActivity.data)

  const { strategiesOptions, tokensOptions, protocolsOptions } = useMemo(
    () => mapMultiselectOptions(vaultsList),
    [vaultsList],
  )

  const handleMoreItems = async () => {
    const res = await getRebalanceActivity({
      page: currentPage + 1,
      tokens: tokenFilter,
      strategies: strategyFilter,
    })

    setCurrentlyLoadedList((prev) => [...prev, ...res.data])
    setCurrentPage((prev) => prev + 1)
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

    getRebalanceActivity({
      page: 1,
      tokens: tokenFilter,
      strategies: strategyFilter,
      sortBy: 'timestamp',
      orderBy: 'desc',
    })
      .then((res) => {
        setCurrentlyLoadedList(res.data)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [strategyFilter, tokenFilter])

  const { totalItems } = rebalanceActivity.pagination

  const savedTimeInHours = useMemo(() => getRebalanceSavedTimeInHours(totalItems), [totalItems])
  const savedGasCost = useMemo(() => getRebalanceSavedGasCost(vaultsList), [vaultsList])

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
        hasMore={
          rebalanceActivity.pagination.totalPages > currentPage &&
          !isLoading &&
          rebalanceActivity.data.length > 0
        }
      >
        <RebalanceActivityTable
          rebalanceActivityList={currentlyLoadedList}
          customRow={{
            idx: 3,
            content: <TableCarousel carouselData={rebalanceActivityTableCarouselData} />,
          }}
        />
      </InfiniteScroll>
    </div>
  )
}
