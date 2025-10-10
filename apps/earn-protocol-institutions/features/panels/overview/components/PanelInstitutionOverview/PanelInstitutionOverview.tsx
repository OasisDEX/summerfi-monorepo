import { useMemo } from 'react'
import {
  Card,
  getUniqueVaultId,
  Table,
  type TableRow,
  Text,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'
import { formatCryptoBalance, getVaultNiceName } from '@summerfi/app-utils'
import Link from 'next/link'

import { vaultsListColumns } from '@/features/panels/overview/components/PanelInstitutionOverview/constants'
import { type VaultsListTableColumns } from '@/features/panels/overview/components/PanelInstitutionOverview/types'
import { getInstitutionVaultUrl } from '@/helpers/get-url'

import panelInstitutionOverviewStyles from './PanelInstitutionOverview.module.css'

const TableCellRightAlign = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{children}</div>
)

const mapVaultTableRows: (
  vaults: SDKVaultishType[],
  institutionName: string,
) => TableRow<VaultsListTableColumns>[] = (vaults, institutionName) => {
  return vaults.map((vault) => ({
    id: getUniqueVaultId(vault),
    content: {
      vault: getVaultNiceName({ vault }),
      value: (
        <TableCellRightAlign>${formatCryptoBalance(vault.totalValueLockedUSD)}</TableCellRightAlign>
      ),
      '30dAPY': <TableCellRightAlign>-</TableCellRightAlign>,
      NAV: (
        <TableCellRightAlign>
          <Link
            href={getInstitutionVaultUrl({
              institutionName,
              vault,
            })}
            style={{
              marginRight: '20px',
            }}
          >
            <WithArrow>View</WithArrow>
          </Link>
        </TableCellRightAlign>
      ),
    },
  }))
}

export const PanelInstitutionOverview = ({
  institutionName,
  institutionVaults,
}: {
  institutionName: string
  institutionVaults: SDKVaultishType[]
}) => {
  const vaultsTableList = useMemo(
    () => mapVaultTableRows(institutionVaults, institutionName),
    [institutionVaults, institutionName],
  )

  return (
    <div className={panelInstitutionOverviewStyles.wrapper}>
      <Card variant="cardSecondary">AUM graph placeholder</Card>
      <Card variant="cardSecondary" className={panelInstitutionOverviewStyles.yourVaultsWrapper}>
        <Text variant="h5">Your Vaults</Text>
        <Card variant="cardPrimary">
          <Table rows={vaultsTableList} columns={vaultsListColumns} />
        </Card>
      </Card>
    </div>
  )
}
