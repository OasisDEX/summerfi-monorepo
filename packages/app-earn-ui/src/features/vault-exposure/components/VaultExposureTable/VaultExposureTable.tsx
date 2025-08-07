'use client'
import { type FC, type ReactNode, useCallback, useMemo, useState } from 'react'
import {
  type GetInterestRatesParams,
  type SDKVaultType,
  type VaultApyData,
} from '@summerfi/app-types'
import { formatDecimalAsPercent } from '@summerfi/app-utils'

import { Table, type TableSortedColumn } from '@/components/organisms/Table/Table'
import {
  vaultExposureColumns,
  vaultExposureColumnsHiddenOnMobile,
} from '@/features/vault-exposure/table/columns'
import { vaultExposureMapper } from '@/features/vault-exposure/table/mapper'
import { useApyUpdatedAt } from '@/hooks/use-apy-updated-at'
import { useHoldAlt } from '@/hooks/use-hold-alt'

interface VaultExposureTableProps {
  vault: SDKVaultType
  customRow?: {
    idx: number
    content: ReactNode
  }
  hiddenColumns?: string[]
  rowsToDisplay?: number
  arksInterestRates: GetInterestRatesParams
  vaultApyData: VaultApyData
  isMobile: boolean
}

export const VaultExposureTable: FC<VaultExposureTableProps> = ({
  vault,
  customRow,
  hiddenColumns,
  rowsToDisplay,
  arksInterestRates,
  vaultApyData,
  isMobile,
}) => {
  const [sortConfig, setSortConfig] = useState<TableSortedColumn<string>>()

  const rows = useMemo(
    () => vaultExposureMapper(vault, arksInterestRates, sortConfig).slice(0, rowsToDisplay),
    [vault, arksInterestRates, sortConfig, rowsToDisplay],
  )

  const handleSort = useCallback(
    (nextSortConfig: TableSortedColumn<string>) => setSortConfig(nextSortConfig),
    [],
  )

  const resolvedHiddenColumns = isMobile ? vaultExposureColumnsHiddenOnMobile : hiddenColumns
  const isAltPressed = useHoldAlt()
  const apyCurrent = vaultApyData.apy ? formatDecimalAsPercent(vaultApyData.apy) : 'New strategy'
  const apyUpdatedAt = useApyUpdatedAt({
    vaultApyData,
  })

  const columns = useMemo(() => {
    return vaultExposureColumns({
      apyCurrent,
      apyUpdatedAt,
      isAltPressed,
    })
  }, [apyCurrent, apyUpdatedAt, isAltPressed])

  return (
    <Table
      rows={rows}
      columns={columns}
      customRow={customRow}
      handleSort={handleSort}
      hiddenColumns={resolvedHiddenColumns}
    />
  )
}
