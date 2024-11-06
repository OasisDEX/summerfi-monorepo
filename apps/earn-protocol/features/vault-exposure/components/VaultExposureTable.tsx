import { type FC, type ReactNode, useMemo, useState } from 'react'
import { Table, type TableSortedColumn } from '@summerfi/app-earn-ui'
import { type SDKVaultType } from '@summerfi/app-types'

import { vaultExposureColumns } from '@/components/organisms/VaultExposure/columns'
import { vaultExposureMapper } from '@/components/organisms/VaultExposure/mapper'

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

  const rows = useMemo(() => vaultExposureMapper(vault, sortConfig), [vault, sortConfig])

  return (
    <Table
      rows={rows.slice(0, rowsToDisplay)}
      columns={vaultExposureColumns}
      customRow={customRow}
      handleSort={(_sortConfig) => setSortConfig(_sortConfig)}
      hiddenColumns={hiddenColumns}
    />
  )
}
