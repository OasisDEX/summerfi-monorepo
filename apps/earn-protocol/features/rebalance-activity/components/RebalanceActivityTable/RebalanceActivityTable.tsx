'use client'
import { type FC, type ReactNode, useMemo, useState } from 'react'
import { Table, type TableSortedColumn, Text, useMobileCheck } from '@summerfi/app-earn-ui'
import { type SDKGlobalRebalancesType } from '@summerfi/app-types'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import {
  rebalancingActivityColumns,
  rebalancingActivityColumnsHiddenOnMobile,
} from '@/features/rebalance-activity/table/columns'
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
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const rows = useMemo(
    () => rebalancingActivityMapper(rebalancesList, sortConfig),
    [rebalancesList, sortConfig],
  )

  const resolvedHiddenColumns = isMobile ? rebalancingActivityColumnsHiddenOnMobile : hiddenColumns

  return (
    <>
      <Table
        rows={rows.slice(0, rowsToDisplay)}
        columns={rebalancingActivityColumns}
        customRow={customRow}
        handleSort={(_sortConfig) => setSortConfig(_sortConfig)}
        hiddenColumns={resolvedHiddenColumns}
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
