'use client'
import { type FC, type ReactNode, useMemo, useState } from 'react'
import { Table, type TableSortedColumn, Text, useMobileCheck } from '@summerfi/app-earn-ui'
import { type SDKUsersActivityType } from '@summerfi/app-types'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import {
  topDepositorsColumns,
  topDepositorsColumnsHiddenOnMobile,
  topDepositorsColumnsHiddenOnTablet,
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
  const { deviceType } = useDeviceType()
  const { isMobile, isTablet } = useMobileCheck(deviceType)

  const rows = useMemo(
    () => topDepositorsMapper(topDepositorsList, sortConfig),
    [topDepositorsList, sortConfig],
  )

  const resolvedHiddenColumns = isTablet
    ? topDepositorsColumnsHiddenOnTablet
    : isMobile
      ? topDepositorsColumnsHiddenOnMobile
      : hiddenColumns

  return (
    <>
      <Table
        rows={rows.slice(0, rowsToDisplay)}
        columns={topDepositorsColumns}
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
