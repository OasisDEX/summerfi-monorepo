import { type FC, type ReactNode, useMemo } from 'react'
import { Table, type TableSortedColumn, Text, useMobileCheck } from '@summerfi/app-earn-ui'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { type Referrals } from '@/features/beach-club/types'

import { yourReferralsColumns, yourReferralsColumnsHiddenOnMobile } from './columns'
import { trackReferralsMapper } from './mapper'

interface BeachClubYourReferralsTableProps {
  trackReferralsList: Referrals[]
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

export const BeachClubYourReferralsTable: FC<BeachClubYourReferralsTableProps> = ({
  trackReferralsList,
  hiddenColumns,
  rowsToDisplay,
  handleSort,
  isLoading,
  skeletonLines,
  customRow,
}) => {
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const rows = useMemo(() => trackReferralsMapper(trackReferralsList), [trackReferralsList])

  const resolvedHiddenColumns = isMobile ? yourReferralsColumnsHiddenOnMobile : hiddenColumns

  return (
    <>
      <Table
        rows={rows.slice(0, rowsToDisplay)}
        columns={yourReferralsColumns}
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
