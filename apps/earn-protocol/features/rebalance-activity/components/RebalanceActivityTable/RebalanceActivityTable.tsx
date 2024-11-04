import { type FC, type ReactNode, useMemo, useState } from 'react'
import { Table, type TableSortedColumn } from '@summerfi/app-earn-ui'
import { type SDKGlobalRebalancesType } from '@summerfi/app-types'

import { rebalancingActivityColumns } from '@/features/rebalance-activity/table/columns'
import { rebalancingActivityMapper } from '@/features/rebalance-activity/table/mapper'

interface RebalanceActivityTableProps {
  rebalancesList: SDKGlobalRebalancesType
  customRow?: {
    idx: number
    content: ReactNode
  }
  hiddenColumns?: string[]
  rowsToDisplay?: number
}

export const RebalanceActivityTable: FC<RebalanceActivityTableProps> = ({
  rebalancesList,
  customRow,
  hiddenColumns,
  rowsToDisplay,
}) => {
  const [sortConfig, setSortConfig] = useState<TableSortedColumn<string>>()

  const rows = useMemo(
    () => rebalancingActivityMapper(rebalancesList, sortConfig),
    [rebalancesList, sortConfig],
  )

  return (
    <Table
      rows={rows.slice(0, rowsToDisplay)}
      columns={rebalancingActivityColumns}
      customRow={customRow}
      handleSort={(_sortConfig) => setSortConfig(_sortConfig)}
      hiddenColumns={hiddenColumns}
    />
  )
}
