'use client'
import { type FC, type ReactNode, useMemo } from 'react'
import { Table, type TableSortedColumn, Text, useMobileCheck } from '@summerfi/app-earn-ui'
import { type TopDepositors } from '@summerfi/summer-protocol-db'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import {
  topDepositorsColumns,
  topDepositorsColumnsHiddenOnMobile,
  topDepositorsColumnsHiddenOnTablet,
} from '@/features/user-activity/table/top-depositors-columns'
import { topDepositorsMapper } from '@/features/user-activity/table/top-depositors-mapper'

interface TopDepositorsTableProps {
  topDepositorsList: TopDepositors[]
  customRow?: {
    idx: number
    content: ReactNode
  }
  hiddenColumns?: string[]
  rowsToDisplay?: number
  handleSort?: (sortConfig: TableSortedColumn<string>) => void
}

export const TopDepositorsTable: FC<TopDepositorsTableProps> = ({
  topDepositorsList,
  customRow,
  hiddenColumns,
  rowsToDisplay,
  handleSort,
}) => {
  const { deviceType } = useDeviceType()
  const { isMobile, isTablet } = useMobileCheck(deviceType)

  const rows = useMemo(() => topDepositorsMapper(topDepositorsList), [topDepositorsList])

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
        handleSort={handleSort}
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
