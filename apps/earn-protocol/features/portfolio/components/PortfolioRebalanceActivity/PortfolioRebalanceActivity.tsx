import { type FC, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import {
  Card,
  DataBlock,
  GenericMultiselect,
  getUniqueVaultId,
  Icon,
  LoadingSpinner,
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
} from '@summerfi/app-utils'

import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { type PositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'
import { useRebalanceActivityInfiniteQuery } from '@/features/rebalance-activity/api/get-rebalance-activity'
import { RebalanceActivityTable } from '@/features/rebalance-activity/components/RebalanceActivityTable/RebalanceActivityTable'
import { mapMultiselectOptions } from '@/features/rebalance-activity/table/filters/mappers'

import classNames from './PortfolioRebalanceActivity.module.css'

interface PortfolioRebalanceActivityProps {
  rebalanceActivity: RebalanceActivityPagination
  walletAddress: string
  positions: PositionWithVault[]
  vaultsList: SDKVaultsListType
}

export const PortfolioRebalanceActivity: FC<PortfolioRebalanceActivityProps> = ({
  rebalanceActivity,
  walletAddress,
  positions,
  vaultsList,
}) => {
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const { totalItems } = rebalanceActivity.pagination

  // Portfolio-specific state for filters
  const [strategyFilter, setStrategyFilter] = useState<string[]>([])
  const [tokenFilter, setTokenFilter] = useState<string[]>([])
  const [protocolFilter, setProtocolFilter] = useState<string[]>([])

  const savedTimeInHours = useMemo(() => getRebalanceSavedTimeInHours(totalItems), [totalItems])
  const savedGasCost = useMemo(
    () => getRebalanceSavedGasCost(rebalanceActivity.totalItemsPerStrategyId),
    [rebalanceActivity.totalItemsPerStrategyId],
  )

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

  // For portfolio component, hydrate from server only when no filters are applied
  // since this component uses local state instead of URL params
  const shouldHydrateFromServer =
    strategyFilter.length === 0 && tokenFilter.length === 0 && protocolFilter.length === 0

  const { data, isPending, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useRebalanceActivityInfiniteQuery({
      tokens: tokenFilter,
      strategies: strategyFilter.length > 0 ? strategyFilter : userVaultStrategies,
      protocols: protocolFilter,
      sortBy: 'timestamp',
      orderBy: 'desc',
      userAddress: walletAddress,
      initialData: shouldHydrateFromServer ? rebalanceActivity : undefined,
    })

  const currentlyLoadedList = useMemo(
    () => (data ? data.pages.flatMap((p) => p.data) : rebalanceActivity.data),
    [data, rebalanceActivity.data],
  )

  const genericMultiSelectFilters = [
    {
      options: strategiesOptions,
      label: 'Strategies',
      onChange: (strategies: string[]) => {
        setStrategyFilter(strategies)
      },
      initialValues: strategyFilter,
    },
    {
      options: tokensOptions,
      label: 'Tokens',
      onChange: (tokens: string[]) => {
        setTokenFilter(tokens)
      },
      initialValues: tokenFilter,
    },
    {
      options: protocolsOptions,
      label: 'Protocols',
      onChange: (protocols: string[]) => {
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
      title: 'Rebalance actions',
      value: formatWithSeparators(totalItems),
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}>
          User saved time
          <Tooltip
            tooltip="Time user avoid spending on manual position upkeep, estimated at about five minutes for every transaction the keeper network automates."
            tooltipWrapperStyles={{ minWidth: '230px' }}
          >
            <Icon iconName="info" size={18} />
          </Tooltip>
        </div>
      ),
      value: `${formatWithSeparators(savedTimeInHours)} hours`,
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}>
          Gas cost savings
          <Tooltip
            tooltip="Gas fees user sidestep when the keeper handles trades, using typical mainnet-dollar and L2-cent costs for each transaction."
            tooltipWrapperStyles={{ minWidth: '230px' }}
          >
            <Icon iconName="info" size={18} />
          </Tooltip>
        </div>
      ),
      value: `$${formatFiatBalance(savedGasCost)}`,
    },
  ]

  return (
    <Card className={classNames.wrapper} variant="cardSecondary">
      <Text as="h5" variant="h5" className={classNames.header}>
        Rebalance Activity
      </Text>
      <div className={classNames.cardsWrapper}>
        {blocks.map((block) => (
          <Card key={block.value} className={classNames.card}>
            <DataBlock
              key={block.value}
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
        <RebalanceActivityTable
          rebalanceActivityList={currentlyLoadedList}
          isLoading={isPending}
          walletAddress={walletAddress}
        />
      </InfiniteScroll>
    </Card>
  )
}
