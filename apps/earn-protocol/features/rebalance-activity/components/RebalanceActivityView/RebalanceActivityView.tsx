'use client'
import { type FC, useMemo, useState } from 'react'
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
import { type SDKGlobalRebalancesType, type SDKVaultsListType } from '@summerfi/app-types'
import { getRebalanceSavedGasCost, getRebalanceSavedTimeInHours } from '@summerfi/app-utils'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { RebalanceActivityTable } from '@/features/rebalance-activity/components/RebalanceActivityTable/RebalanceActivityTable'
import {
  getRebalanceActivityHeadingCards,
  rebalanceActivityHeading,
} from '@/features/rebalance-activity/components/RebalanceActivityView/cards'
import { rebalanceActivityTableCarouselData } from '@/features/rebalance-activity/components/RebalanceActivityView/carousel'
import { rebalanceActivityFilter } from '@/features/rebalance-activity/table/filters/filters'
import { mapMultiselectOptions } from '@/features/rebalance-activity/table/filters/mappers'

import classNames from './RebalanceActivityView.module.scss'

interface RebalanceActivityViewProps {
  vaultsList: SDKVaultsListType
  rebalancesList: SDKGlobalRebalancesType
  searchParams?: { [key: string]: string[] }
}

const ITEMS_PER_PAGE = 10

export const RebalanceActivityView: FC<RebalanceActivityViewProps> = ({
  vaultsList,
  rebalancesList: initialRebalancesList,
  searchParams,
}) => {
  const { setQueryParams } = useQueryParams()
  const [strategyFilter, setStrategyFilter] = useState<string[]>(searchParams?.strategies ?? [])
  const [tokenFilter, setTokenFilter] = useState<string[]>(searchParams?.tokens ?? [])
  const [protocolFilter, setProtocolFilter] = useState<string[]>(searchParams?.protocols ?? [])
  const currentUrl = useCurrentUrl()
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const [rebalancesList, setRebalancesList] = useState(initialRebalancesList)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const { strategiesOptions, tokensOptions, protocolsOptions } = useMemo(
    () => mapMultiselectOptions(vaultsList),
    [vaultsList],
  )

  const loadMoreRebalances = async () => {
    if (isLoading) return

    try {
      setIsLoading(true)
      const skip = currentPage * ITEMS_PER_PAGE

      const response = await fetch(
        `/earn/api/rebalance-activity?first=${ITEMS_PER_PAGE}&skip=${skip}&orderBy=timestamp&orderDirection=desc`,
      )

      if (!response.ok) {
        throw new Error('Failed to fetch rebalances')
      }

      const newRebalances = await response.json()

      if (newRebalances.rebalances.length < ITEMS_PER_PAGE) {
        setHasMore(false)
      }

      setRebalancesList((prev) => [...prev, ...newRebalances.rebalances])
      setCurrentPage((prev) => prev + 1)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading more rebalances:', error)
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredList = useMemo(
    () =>
      rebalanceActivityFilter({
        rebalancesList,
        strategyFilter,
        tokenFilter,
        protocolFilter,
      }),
    [rebalancesList, strategyFilter, tokenFilter, protocolFilter],
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

  const totalItems = vaultsList.reduce((acc, vault) => acc + Number(vault.rebalanceCount), 0)

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
      <InfiniteScroll loadMore={loadMoreRebalances} hasMore={hasMore && !isLoading}>
        <RebalanceActivityTable
          rebalancesList={filteredList}
          customRow={{
            idx: 3,
            content: <TableCarousel carouselData={rebalanceActivityTableCarouselData} />,
          }}
        />
        <div className={classNames.loader}>
          <LoadingSpinner />
        </div>
      </InfiniteScroll>
    </div>
  )
}
