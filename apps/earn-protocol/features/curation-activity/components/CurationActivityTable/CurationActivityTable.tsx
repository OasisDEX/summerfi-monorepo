'use client'

import { type FC, useMemo } from 'react'
import { Table, Text, useMobileCheck } from '@summerfi/app-earn-ui'
import { type SDKVaultishType, type SDKVaultType } from '@summerfi/app-types'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import {
  curationActivityColumns,
  curationActivityColumnsHiddenOnMobile,
  curationActivityColumnsHiddenOnTablet,
} from '@/features/curation-activity/table/columns'
import { curationActivityMapper } from '@/features/curation-activity/table/mapper'
import { type VaultCurationEvent } from '@/features/curation-activity/types'

interface CurationActivityTableProps {
  vault: SDKVaultType | SDKVaultishType
  curationEvents: VaultCurationEvent[]
  hiddenColumns?: string[]
  rowsToDisplay?: number
  skeletonLines?: number
}

export const CurationActivityTable: FC<CurationActivityTableProps> = ({
  vault,
  curationEvents,
  hiddenColumns,
  rowsToDisplay,
  skeletonLines,
}) => {
  const { deviceType } = useDeviceType()
  const { isMobile, isTablet } = useMobileCheck(deviceType)

  const rows = useMemo(() => curationActivityMapper(curationEvents, vault), [curationEvents, vault])

  const resolvedHiddenColumns = isTablet
    ? curationActivityColumnsHiddenOnTablet
    : isMobile
      ? curationActivityColumnsHiddenOnMobile
      : hiddenColumns

  return (
    <>
      <Table
        rows={rows.slice(0, rowsToDisplay)}
        columns={curationActivityColumns}
        hiddenColumns={resolvedHiddenColumns}
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
          No Portfolio Composition History available for the previous 30 days
        </Text>
      )}
    </>
  )
}
