'use client'
import { type FC, type ReactNode, useCallback, useMemo, useState } from 'react'
import {
  Table,
  type TableSortedColumn,
  useApyUpdatedAt,
  useHoldAlt,
  useMobileCheck,
} from '@summerfi/app-earn-ui'
import { type SDKVaultType, type VaultApyData } from '@summerfi/app-types'
import { formatDecimalAsPercent } from '@summerfi/app-utils'

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
  vaultApyData: VaultApyData
}

export const VaultExposureTable: FC<VaultExposureTableProps> = ({
  vault,
  customRow,
  hiddenColumns,
  rowsToDisplay,
  arksInterestRates,
  vaultApyData,
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
