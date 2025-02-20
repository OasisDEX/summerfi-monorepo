'use client'
import { type FC, type ReactNode, useMemo, useState } from 'react'
import { Table, type TableSortedColumn, useMobileCheck } from '@summerfi/app-earn-ui'
import { type SDKVaultType } from '@summerfi/app-types'

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
  arksInterestRates?: { [key: string]: number }
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
    () => vaultExposureMapper(vault, arksInterestRates, sortConfig),
    [vault, arksInterestRates, sortConfig],
  )

  const resolvedHiddenColumns = isMobile ? vaultExposureColumnsHiddenOnMobile : hiddenColumns

  return (
    <Table
      rows={rows.slice(0, rowsToDisplay)}
      columns={vaultExposureColumns}
      customRow={customRow}
      handleSort={(_sortConfig) => setSortConfig(_sortConfig)}
      hiddenColumns={resolvedHiddenColumns}
    />
  )
}
