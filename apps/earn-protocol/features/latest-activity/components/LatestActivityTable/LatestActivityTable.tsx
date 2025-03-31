'use client'
import { type FC, type ReactNode, useMemo, useState } from 'react'
import { Table, type TableSortedColumn, Text, useMobileCheck } from '@summerfi/app-earn-ui'
import { type LatestActivity } from '@summerfi/summer-protocol-db'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import {
  latestActivityColumns,
  latestActivityColumnsHiddenOnMobile,
  latestActivityColumnsHiddenOnTablet,
} from '@/features/latest-activity/table/latest-activity-columns'
import { latestActivityMapper } from '@/features/latest-activity/table/latest-activity-mapper'

interface LatestActivityTableProps {
  latestActivityList: LatestActivity[]
  customRow?: {
    idx: number
    content: ReactNode
  }
  hiddenColumns?: string[]
  rowsToDisplay?: number
  noHighlight?: boolean
  handleSort?: (sortConfig: TableSortedColumn<string>) => void
  isLoading?: boolean
  skeletonLines?: number
}

export const LatestActivityTable: FC<LatestActivityTableProps> = ({
  latestActivityList,
  customRow,
  hiddenColumns,
  rowsToDisplay,
  noHighlight,
  handleSort,
  isLoading,
  skeletonLines,
}) => {
  const { deviceType } = useDeviceType()
  const { isMobile, isTablet } = useMobileCheck(deviceType)
  const [highlightedAddress, setHighlightedAddress] = useState<string | undefined>()

  const rows = useMemo(() => latestActivityMapper(latestActivityList), [latestActivityList])

  const resolvedHiddenColumns = isTablet
    ? latestActivityColumnsHiddenOnTablet
    : isMobile
      ? latestActivityColumnsHiddenOnMobile
      : hiddenColumns

  return (
    <>
      <Table
        rows={rows.slice(0, rowsToDisplay)}
        columns={latestActivityColumns}
        customRow={customRow}
        handleSort={handleSort}
        hiddenColumns={resolvedHiddenColumns}
        onRowHover={!noHighlight ? (id?: string) => setHighlightedAddress(id) : undefined}
        highlightedRow={!noHighlight ? highlightedAddress : undefined}
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
