import { type FC, type ReactNode, useMemo, useState } from 'react'
import { Table, type TableSortedColumn, useMobileCheck } from '@summerfi/app-earn-ui'
import { type SDKUsersActivityType } from '@summerfi/app-types'

import {
  topDepositorsColumns,
  topDepositorsColumnsHiddenOnMobile,
} from '@/features/user-activity/table/top-depositors-columns'
import { topDepositorsMapper } from '@/features/user-activity/table/top-depositors-mapper'

interface TopDepositorsTableProps {
  topDepositorsList: SDKUsersActivityType
  customRow?: {
    idx: number
    content: ReactNode
  }
  hiddenColumns?: string[]
  rowsToDisplay?: number
}

export const TopDepositorsTable: FC<TopDepositorsTableProps> = ({
  topDepositorsList,
  customRow,
  hiddenColumns,
  rowsToDisplay,
}) => {
  const [sortConfig, setSortConfig] = useState<TableSortedColumn<string>>()
  const { isMobile } = useMobileCheck()

  const rows = useMemo(
    () => topDepositorsMapper(topDepositorsList, sortConfig),
    [topDepositorsList, sortConfig],
  )

  const resolvedHiddenColumns = isMobile ? topDepositorsColumnsHiddenOnMobile : hiddenColumns

  return (
    <Table
      rows={rows.slice(0, rowsToDisplay)}
      columns={topDepositorsColumns}
      customRow={customRow}
      handleSort={(_sortConfig) => setSortConfig(_sortConfig)}
      hiddenColumns={resolvedHiddenColumns}
    />
  )
}
