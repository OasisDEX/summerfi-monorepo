'use client'
import { type FC, type ReactNode, useMemo, useState } from 'react'
import { Table, type TableSortedColumn, Text, useMobileCheck } from '@summerfi/app-earn-ui'
import { type UsersActivity } from '@summerfi/app-types'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import {
  userActivityColumns,
  userActivityColumnsHiddenOnMobile,
  userActivityColumnsHiddenOnTablet,
} from '@/features/user-activity/table/user-activity-columns'
import { userActivityMapper } from '@/features/user-activity/table/user-activity-mapper'

interface UserActivityTableProps {
  userActivityList: UsersActivity
  customRow?: {
    idx: number
    content: ReactNode
  }
  hiddenColumns?: string[]
  rowsToDisplay?: number
  noHighlight?: boolean
}

export const UserActivityTable: FC<UserActivityTableProps> = ({
  userActivityList,
  customRow,
  hiddenColumns,
  rowsToDisplay,
  noHighlight,
}) => {
  const [sortConfig, setSortConfig] = useState<TableSortedColumn<string>>()
  const { deviceType } = useDeviceType()
  const { isMobile, isTablet } = useMobileCheck(deviceType)
  const [highlightedAddress, setHighlightedAddress] = useState<string | undefined>()

  const rows = useMemo(
    () => userActivityMapper(userActivityList, sortConfig),
    [userActivityList, sortConfig],
  )

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
        handleSort={(_sortConfig) => setSortConfig(_sortConfig)}
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
