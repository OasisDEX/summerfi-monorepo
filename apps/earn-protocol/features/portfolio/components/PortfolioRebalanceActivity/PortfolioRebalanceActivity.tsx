import { type FC, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { Card, DataBlock, getUniqueVaultId, Icon, Text, Tooltip } from '@summerfi/app-earn-ui'
import { type SDKVaultsListType } from '@summerfi/app-types'
import {
  formatFiatBalance,
  formatShorthandNumber,
  getRebalanceSavedGasCost,
  getRebalanceSavedTimeInHours,
} from '@summerfi/app-utils'

import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { PortfolioRebalanceActivityList } from '@/features/portfolio/components/PortfolioRebalanceActivityList/PortfolioRebalanceActivityList'
import { type PositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'
import { getRebalanceActivity } from '@/features/rebalance-activity/api/get-rebalance-activity'

import classNames from './PortfolioRebalanceActivity.module.scss'

interface PortfolioRebalanceActivityProps {
  rebalanceActivity: RebalanceActivityPagination
  walletAddress: string
  vaultsList: SDKVaultsListType
  positions: PositionWithVault[]
}

export const PortfolioRebalanceActivity: FC<PortfolioRebalanceActivityProps> = ({
  rebalanceActivity,
  walletAddress,
  vaultsList,
  positions,
}) => {
  const { totalItems } = rebalanceActivity.pagination

  const savedTimeInHours = useMemo(() => getRebalanceSavedTimeInHours(totalItems), [totalItems])
  const savedGasCost = useMemo(() => getRebalanceSavedGasCost(vaultsList), [vaultsList])

  const [currentPage, setCurrentPage] = useState(rebalanceActivity.pagination.currentPage)

  const [currentlyLoadedList, setCurrentlyLoadedList] = useState(rebalanceActivity.data)

  const handleMoreItems = async () => {
    const res = await getRebalanceActivity({
      page: currentPage + 1,
      sortBy: 'timestamp',
      orderBy: 'desc',
      strategies: positions.map((position) => getUniqueVaultId(position.vault)),
    })

    setCurrentlyLoadedList((prev) => [...prev, ...res.data])
    setCurrentPage((prev) => prev + 1)
  }

  const blocks = [
    {
      title: 'Rebalance actions',
      value: formatShorthandNumber(totalItems, { precision: 0 }),
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
      value: `${savedTimeInHours} hours`,
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
        hasMore={
          rebalanceActivity.pagination.totalPages > currentPage && currentlyLoadedList.length > 0
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
