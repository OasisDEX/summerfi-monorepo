import { type FC, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import {
  Card,
  DataBlock,
  GenericMultiselect,
  getUniqueVaultId,
  Icon,
  LoadingSpinner,
  SkeletonLine,
  Text,
  Tooltip,
  useMobileCheck,
} from '@summerfi/app-earn-ui'
import { type SDKVaultsListType } from '@summerfi/app-types'
import {
  formatFiatBalance,
  formatWithSeparators,
  getRebalanceSavedGasCost,
  getRebalanceSavedTimeInHours,
  slugify,
} from '@summerfi/app-utils'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { type PositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'
import { useRebalanceActivityInfiniteQuery } from '@/features/rebalance-activity/api/get-rebalance-activity'
import { RebalanceActivityTable } from '@/features/rebalance-activity/components/RebalanceActivityTable/RebalanceActivityTable'
import { mapMultiselectOptions } from '@/features/rebalance-activity/table/filters/mappers'
import { useHandleDropdownChangeEvent, useHandleTooltipOpenEvent } from '@/hooks/use-mixpanel-event'

import classNames from './PortfolioRebalanceActivity.module.css'

interface PortfolioRebalanceActivityProps {
  viewWalletAddress: string
  positions: PositionWithVault[]
  vaultsList: SDKVaultsListType
}

export const PortfolioRebalanceActivity: FC<PortfolioRebalanceActivityProps> = ({
  viewWalletAddress,
  positions,
  vaultsList,
}) => {
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const dropdownChangeHandler = useHandleDropdownChangeEvent()
  const tooltipEventHandler = useHandleTooltipOpenEvent()

  // Portfolio-specific state for filters
  const [strategyFilter, setStrategyFilter] = useState<string[]>([])
  const [tokenFilter, setTokenFilter] = useState<string[]>([])
  const [protocolFilter, setProtocolFilter] = useState<string[]>([])

  const resolvedVaultsList = useMemo(() => {
    const userVaults = positions.map(({ vault }) => getUniqueVaultId(vault))

    return vaultsList.filter((vault) => userVaults.includes(getUniqueVaultId(vault)))
  }, [vaultsList, positions])

  const { strategiesOptions, tokensOptions, protocolsOptions } = useMemo(
    () => mapMultiselectOptions(resolvedVaultsList),
    [resolvedVaultsList],
  )

  // Get user's vault strategies for the API call
  const userVaultStrategies = useMemo(
    () => positions.map((position) => getUniqueVaultId(position.vault)),
    [positions],
  )

  const { data, isPending, isError, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useRebalanceActivityInfiniteQuery({
      tokens: tokenFilter,
      strategies: strategyFilter.length > 0 ? strategyFilter : userVaultStrategies,
      protocols: protocolFilter,
      sortBy: 'timestamp',
      orderBy: 'desc',
      userAddress: viewWalletAddress,
    })

  const currentlyLoadedList = useMemo(() => (data ? data.pages.flatMap((p) => p.data) : []), [data])

  const summarySource = data?.pages[0]
  const totalItems = summarySource?.pagination.totalItems ?? currentlyLoadedList.length
  const savedTimeInHours = useMemo(() => getRebalanceSavedTimeInHours(totalItems), [totalItems])
  const savedGasCost = useMemo(
    () => getRebalanceSavedGasCost(summarySource?.totalItemsPerStrategyId ?? []),
    [summarySource?.totalItemsPerStrategyId],
  )

  const genericMultiSelectFilters = [
    {
      options: strategiesOptions,
      label: 'Strategies',
      onChange: (strategies: string[]) => {
        dropdownChangeHandler({
          inputName: 'portfolio-rebalance-activity-strategy-filter',
          value: strategies.map(slugify).join(','),
        })
        setStrategyFilter(strategies)
      },
      initialValues: strategyFilter,
    },
    {
      options: tokensOptions,
      label: 'Tokens',
      onChange: (tokens: string[]) => {
        dropdownChangeHandler({
          inputName: 'portfolio-your-rebalance-token-filter',
          value: tokens.map(slugify).join(','),
        })
        setTokenFilter(tokens)
      },
      initialValues: tokenFilter,
    },
    {
      options: protocolsOptions,
      label: 'Protocols',
      onChange: (protocols: string[]) => {
        dropdownChangeHandler({
          inputName: 'portfolio-your-rebalance-network-filter',
          value: protocols.map(slugify).join(','),
        })
        setProtocolFilter(protocols)
      },
      initialValues: protocolFilter,
    },
  ]

  const handleLoadMore = () => {
    if (isFetchingNextPage || !hasNextPage) return
    void fetchNextPage()
  }

  const blocks = [
    {
      id: 'rebalance-actions',
      title: 'Rebalance actions',
      value: isPending ? (
        <SkeletonLine width={160} height={40} />
      ) : (
        formatWithSeparators(totalItems)
      ),
    },
    {
      id: 'user-saved-time',
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}>
          User saved time
          <Tooltip
            tooltip="Time user avoid spending on manual position upkeep, estimated at about five minutes for every transaction the keeper network automates."
            tooltipWrapperStyles={{ minWidth: '230px' }}
            onTooltipOpen={tooltipEventHandler}
            tooltipName="portfolio-rebalance-activity-user-saved-time"
          >
            <Icon iconName="info" size={18} />
          </Tooltip>
        </div>
      ),
      value: isPending ? (
        <SkeletonLine width={160} height={40} />
      ) : (
        `${formatWithSeparators(savedTimeInHours)} hours`
      ),
    },
    {
      id: 'gas-cost-savings',
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}>
          Gas cost savings
          <Tooltip
            tooltip="Gas fees user sidestep when the keeper handles trades, using typical mainnet-dollar and L2-cent costs for each transaction."
            tooltipWrapperStyles={{ minWidth: '230px' }}
            onTooltipOpen={tooltipEventHandler}
            tooltipName="portfolio-rebalance-activity-gas-cost-savings"
          >
            <Icon iconName="info" size={18} />
          </Tooltip>
        </div>
      ),
      value: isPending ? (
        <SkeletonLine width={160} height={40} />
      ) : (
        `$${formatFiatBalance(savedGasCost)}`
      ),
    },
  ]

  return (
    <Card className={classNames.wrapper} variant="cardSecondary">
      <Text as="h5" variant="h5" className={classNames.header}>
        Rebalance Activity
      </Text>
      <div className={classNames.cardsWrapper}>
        {blocks.map((block) => (
          <Card key={block.id} className={classNames.card}>
            <DataBlock
              key={block.id}
              title={block.title}
              value={block.value}
              titleSize="large"
              valueSize="large"
            />
          </Card>
        ))}
      </div>
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
        {isError && (
          <Text as="p" variant="p3" style={{ marginBottom: 'var(--spacing-space-small)' }}>
            Rebalance activity is temporarily unavailable. You can keep using the rest of the
            portfolio.
          </Text>
        )}
        <RebalanceActivityTable
          rebalanceActivityList={currentlyLoadedList}
          isLoading={isPending}
          viewWalletAddress={viewWalletAddress}
        />
      </InfiniteScroll>
    </Card>
  )
}
