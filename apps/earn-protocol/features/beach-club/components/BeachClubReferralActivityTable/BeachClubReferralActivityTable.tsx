import { type FC, type ReactNode, useMemo } from 'react'
import { Table, type TableSortedColumn, Text, useMobileCheck } from '@summerfi/app-earn-ui'
import { type LatestActivity } from '@summerfi/summer-protocol-db'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'

import { referralActivityColumns, referralActivityColumnsHiddenOnMobile } from './columns'
import { referralActivityMapper } from './mapper'

interface BeachClubReferralActivityTableProps {
  referralActivityList: LatestActivity[]
  hiddenColumns?: string[]
  rowsToDisplay?: number
  handleSort?: (sortConfig: TableSortedColumn<string>) => void
  isLoading?: boolean
  skeletonLines?: number
  customRow?: {
    idx: number
    content: ReactNode
  }
}

export const BeachClubReferralActivityTable: FC<BeachClubReferralActivityTableProps> = ({
  referralActivityList,
  hiddenColumns,
  rowsToDisplay,
  handleSort,
  isLoading,
  skeletonLines,
  customRow,
}) => {
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const rows = useMemo(() => referralActivityMapper(referralActivityList), [referralActivityList])

  const resolvedHiddenColumns = isMobile ? referralActivityColumnsHiddenOnMobile : hiddenColumns

  return (
    <>
      <Table
        rows={rows.slice(0, rowsToDisplay)}
        columns={referralActivityColumns}
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
