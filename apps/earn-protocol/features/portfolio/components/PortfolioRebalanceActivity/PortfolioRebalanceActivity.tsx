import { type FC, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import {
  Card,
  DataBlock,
  getUniqueVaultId,
  Icon,
  LoadingSpinner,
  Text,
  Tooltip,
} from '@summerfi/app-earn-ui'
import {
  formatFiatBalance,
  formatWithSeparators,
  getRebalanceSavedGasCost,
  getRebalanceSavedTimeInHours,
} from '@summerfi/app-utils'

import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { PortfolioRebalanceActivityList } from '@/features/portfolio/components/PortfolioRebalanceActivityList/PortfolioRebalanceActivityList'
import { type PositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'
import { getRebalanceActivity } from '@/features/rebalance-activity/api/get-rebalance-activity'

import classNames from './PortfolioRebalanceActivity.module.css'

interface PortfolioRebalanceActivityProps {
  rebalanceActivity: RebalanceActivityPagination
  walletAddress: string
  positions: PositionWithVault[]
}

export const PortfolioRebalanceActivity: FC<PortfolioRebalanceActivityProps> = ({
  rebalanceActivity,
  walletAddress,
  positions,
}) => {
  const { totalItems } = rebalanceActivity.pagination

  const [hasMoreItems, setHasMoreItems] = useState(true)

  const savedTimeInHours = useMemo(() => getRebalanceSavedTimeInHours(totalItems), [totalItems])
  const savedGasCost = useMemo(
    () => getRebalanceSavedGasCost(rebalanceActivity.totalItemsPerStrategyId),
    [rebalanceActivity.totalItemsPerStrategyId],
  )

  const [currentPage, setCurrentPage] = useState(rebalanceActivity.pagination.currentPage)

  const [currentlyLoadedList, setCurrentlyLoadedList] = useState(rebalanceActivity.data)

  const handleMoreItems = async () => {
    if (!hasMoreItems) return

    try {
      const res = await getRebalanceActivity({
        page: currentPage + 1,
        sortBy: 'timestamp',
        orderBy: 'desc',
        strategies: positions.map((position) => getUniqueVaultId(position.vault)),
      })

      if (res.data.length === 0 || currentPage + 1 >= rebalanceActivity.pagination.totalPages) {
        setHasMoreItems(false)
      }

      setCurrentlyLoadedList((prev) => [...prev, ...res.data])
      setCurrentPage((prev) => prev + 1)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching rebalance activity', error)
      setHasMoreItems(false)
    }
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
            tooltip="Time users have saved by relying on our AI-Powered keeper network to optimize positions"
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
            tooltip="Gas cost savings achieved by users relying on our AI-Powered keeper network to optimize their positions, instead of manual management."
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
      <div className={classNames.blocksWrapper}>
        {blocks.map((block) => (
          <DataBlock
            key={block.value}
            title={block.title}
            value={block.value}
            titleSize="large"
            valueSize="large"
          />
        ))}
      </div>
      <InfiniteScroll
        loadMore={handleMoreItems}
        hasMore={hasMoreItems}
        loader={
          <LoadingSpinner
            key="spinner"
            style={{ margin: '0 auto', marginTop: 'var(--spacing-space-medium)' }}
          />
        }
      >
        <PortfolioRebalanceActivityList
          rebalanceActivityList={currentlyLoadedList}
          walletAddress={walletAddress}
        />
      </InfiniteScroll>
    </Card>
  )
}
