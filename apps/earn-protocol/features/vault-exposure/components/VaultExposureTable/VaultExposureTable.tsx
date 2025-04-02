'use client'
import { type FC, type ReactNode, useCallback, useMemo, useState } from 'react'
import { Table, type TableSortedColumn, useMobileCheck } from '@summerfi/app-earn-ui'
import { type SDKVaultType } from '@summerfi/app-types'

import { type GetInterestRatesReturnType } from '@/app/server-handlers/interest-rates'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import {
  vaultExposureColumns,
  vaultExposureColumnsHiddenOnMobile,
} from '@/features/vault-exposure/table/columns'
import { vaultExposureMapper } from '@/features/vault-exposure/table/mapper'

interface VaultExposureTableProps {
  vault: SDKVaultType
  customRow?: {
    idx: number
    content: ReactNode
  }
  hiddenColumns?: string[]
  rowsToDisplay?: number
  arksInterestRates: GetInterestRatesReturnType
}

export const VaultExposureTable: FC<VaultExposureTableProps> = ({
  vault,
  customRow,
  hiddenColumns,
  rowsToDisplay,
  arksInterestRates,
}) => {
  const [sortConfig, setSortConfig] = useState<TableSortedColumn<string>>()
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  const rows = useMemo(
    () => vaultExposureMapper(vault, arksInterestRates, sortConfig).slice(0, rowsToDisplay),
    [vault, arksInterestRates, sortConfig, rowsToDisplay],
  )

  const handleSort = useCallback(
    (nextSortConfig: TableSortedColumn<string>) => setSortConfig(nextSortConfig),
    [],
  )

  const resolvedHiddenColumns = isMobile ? vaultExposureColumnsHiddenOnMobile : hiddenColumns

  return (
    <Table
      rows={rows}
      columns={vaultExposureColumns}
      customRow={customRow}
      handleSort={handleSort}
      hiddenColumns={resolvedHiddenColumns}
    />
  )
}
