import { type FC, type ReactNode, useMemo, useState } from 'react'
import { Table, type TableSortedColumn, useMobileCheck } from '@summerfi/app-earn-ui'
import { type SDKVaultType } from '@summerfi/app-types'

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
}

export const VaultExposureTable: FC<VaultExposureTableProps> = ({
  vault,
  customRow,
  hiddenColumns,
  rowsToDisplay,
}) => {
  const [sortConfig, setSortConfig] = useState<TableSortedColumn<string>>()
  const { isMobile } = useMobileCheck()

  const rows = useMemo(() => vaultExposureMapper(vault, sortConfig), [vault, sortConfig])

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
