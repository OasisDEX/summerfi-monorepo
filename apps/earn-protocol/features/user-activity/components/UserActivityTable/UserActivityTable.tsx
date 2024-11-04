import { type FC, type ReactNode, useMemo, useState } from 'react'
import { Table, type TableSortedColumn } from '@summerfi/app-earn-ui'

import { type UsersActivity } from '@/app/server-handlers/sdk/get-users-activity'
import { userActivityColumns } from '@/features/user-activity/table/columns'
import { userActivityMapper } from '@/features/user-activity/table/mapper'

interface UserActivityTableProps {
  userActivityList: UsersActivity
  customRow?: {
    idx: number
    content: ReactNode
  }
  hiddenColumns?: string[]
  rowsToDisplay?: number
}

export const UserActivityTable: FC<UserActivityTableProps> = ({
  userActivityList,
  customRow,
  hiddenColumns,
  rowsToDisplay,
}) => {
  const [sortConfig, setSortConfig] = useState<TableSortedColumn<string>>()

  const rows = useMemo(
    () => userActivityMapper(userActivityList, sortConfig),
    [userActivityList, sortConfig],
  )

  return (
    <Table
      rows={rows.slice(0, rowsToDisplay)}
      columns={userActivityColumns}
      customRow={customRow}
      handleSort={(_sortConfig) => setSortConfig(_sortConfig)}
      hiddenColumns={hiddenColumns}
    />
  )
}
