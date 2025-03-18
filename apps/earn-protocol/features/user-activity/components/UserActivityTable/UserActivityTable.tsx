'use client'
import { type FC, type ReactNode, useMemo, useState } from 'react'
import { Table, type TableSortedColumn, Text, useMobileCheck } from '@summerfi/app-earn-ui'
import { type LatestActivity } from '@summerfi/summer-protocol-db'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import {
  userActivityColumns,
  userActivityColumnsHiddenOnMobile,
  userActivityColumnsHiddenOnTablet,
} from '@/features/user-activity/table/user-activity-columns'
import { userActivityMapper } from '@/features/user-activity/table/user-activity-mapper'

interface UserActivityTableProps {
  userActivityList: LatestActivity[]
  customRow?: {
    idx: number
    content: ReactNode
  }
  hiddenColumns?: string[]
  rowsToDisplay?: number
  noHighlight?: boolean
  handleSort?: (sortConfig: TableSortedColumn<string>) => void
}

export const UserActivityTable: FC<UserActivityTableProps> = ({
  userActivityList,
  customRow,
  hiddenColumns,
  rowsToDisplay,
  noHighlight,
  handleSort,
}) => {
  const { deviceType } = useDeviceType()
  const { isMobile, isTablet } = useMobileCheck(deviceType)
  const [highlightedAddress, setHighlightedAddress] = useState<string | undefined>()

  const rows = useMemo(() => userActivityMapper(userActivityList), [userActivityList])

  const resolvedHiddenColumns = isTablet
    ? userActivityColumnsHiddenOnTablet
    : isMobile
      ? userActivityColumnsHiddenOnMobile
      : hiddenColumns

  return (
    <>
      <Table
        rows={rows.slice(0, rowsToDisplay)}
        columns={userActivityColumns}
        customRow={customRow}
        handleSort={handleSort}
        hiddenColumns={resolvedHiddenColumns}
        onRowHover={!noHighlight ? (id?: string) => setHighlightedAddress(id) : undefined}
        highlightedRow={!noHighlight ? highlightedAddress : undefined}
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
