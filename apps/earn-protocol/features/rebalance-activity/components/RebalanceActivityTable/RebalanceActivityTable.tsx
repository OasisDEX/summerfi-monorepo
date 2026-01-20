'use client'
import { type FC, type ReactNode, useMemo } from 'react'
import { Table, type TableSortedColumn, Text, useMobileCheck } from '@summerfi/app-earn-ui'
import { type RebalanceActivity } from '@summerfi/summer-protocol-db'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import {
  rebalancingActivityColumns,
  rebalancingActivityColumnsHiddenOnMobile,
} from '@/features/rebalance-activity/table/columns'
import { rebalancingActivityMapper } from '@/features/rebalance-activity/table/mapper'

interface RebalanceActivityTableProps {
  rebalanceActivityList: RebalanceActivity[]
  customRow?: {
    idx: number
    content: ReactNode
  }
  hiddenColumns?: string[]
  rowsToDisplay?: number
  handleSort?: (sortConfig: TableSortedColumn<string>) => void
  isLoading?: boolean
  skeletonLines?: number
  viewWalletAddress?: string
}

export const RebalanceActivityTable: FC<RebalanceActivityTableProps> = ({
  rebalanceActivityList,
  customRow,
  hiddenColumns,
  rowsToDisplay,
  handleSort,
  isLoading,
  skeletonLines,
  viewWalletAddress,
}) => {
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const rows = useMemo(
    () => rebalancingActivityMapper(rebalanceActivityList, viewWalletAddress),
    [rebalanceActivityList, viewWalletAddress],
  )

  const resolvedHiddenColumns = isMobile ? rebalancingActivityColumnsHiddenOnMobile : hiddenColumns

  return (
    <>
      <Table
        rows={rows.slice(0, rowsToDisplay)}
        columns={rebalancingActivityColumns}
        customRow={customRow}
        handleSort={handleSort}
        hiddenColumns={resolvedHiddenColumns}
        isLoading={isLoading}
        skeletonLines={skeletonLines}
      />
      {rows.length === 0 && (
        <Text
          as="p"
          variant="p3semi"
          style={{
            textAlign: 'center',
            marginTop: 'var(--general-space-24)',
            color: 'var(--color-text-secondary)',
          }}
        >
          No activity available to display
        </Text>
      )}
    </>
  )
}
