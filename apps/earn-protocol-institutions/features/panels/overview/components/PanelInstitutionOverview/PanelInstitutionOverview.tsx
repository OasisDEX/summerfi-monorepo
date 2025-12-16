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
import { type MultipleSourceChartData } from '@summerfi/app-types/types/src/earn-protocol'
import {
  formatCryptoBalance,
  formatPercent,
  getVaultNiceName,
  subgraphNetworkToId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import Link from 'next/link'

import { type VaultAdditionalInfo } from '@/app/server-handlers/institution/institution-vaults/types'
import { vaultsListColumns } from '@/features/panels/overview/components/PanelInstitutionOverview/constants'
import { TvlChartIntermediary } from '@/features/panels/overview/components/PanelInstitutionOverview/TvlChartIntermediary'
import { type VaultsListTableColumns } from '@/features/panels/overview/components/PanelInstitutionOverview/types'
import { getInstitutionVaultUrl } from '@/helpers/get-url'

import panelInstitutionOverviewStyles from './PanelInstitutionOverview.module.css'

const TableCellRightAlign = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{children}</div>
)

const mapVaultTableRows: ({
  institutionVaults,
  institutionName,
  vaultsAdditionalInfo,
}: {
  institutionVaults?: SDKVaultishType[]
  institutionName: string
  vaultsAdditionalInfo?: VaultAdditionalInfo
}) => TableRow<VaultsListTableColumns>[] = ({
  institutionVaults,
  institutionName,
  vaultsAdditionalInfo,
}) => {
  return (
    institutionVaults?.map((vault) => {
      const vaultSelector = `${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`

      return {
        id: getUniqueVaultId(vault),
        content: {
          vault: getVaultNiceName({ vault }),
          value: (
            <TableCellRightAlign>
              ${formatCryptoBalance(vault.totalValueLockedUSD)}
            </TableCellRightAlign>
          ),
          '30dAPY': (
            <TableCellRightAlign>
              {formatPercent(vaultsAdditionalInfo?.vaultApyMap[vaultSelector].apy30d ?? 0, {
                precision: 2,
              })}
            </TableCellRightAlign>
          ),
          NAV: (
            <TableCellRightAlign>
              {vaultsAdditionalInfo?.vaultSharePriceMap[vaultSelector]
                ? formatCryptoBalance(vaultsAdditionalInfo.vaultSharePriceMap[vaultSelector])
                : 'n/a'}
            </TableCellRightAlign>
          ),
          action: (
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
      }
    }) ?? []
  )
}

export const PanelInstitutionOverview = ({
  institutionName,
  institutionVaults,
  vaultsAdditionalInfo,
  isLoading,
  vaultsTvlChartData,
}: {
  institutionName: string
  institutionVaults?: SDKVaultishType[]
  vaultsAdditionalInfo?: VaultAdditionalInfo
  isLoading?: boolean
  vaultsTvlChartData?: MultipleSourceChartData
}) => {
  const vaultsTableList = useMemo(
    () => mapVaultTableRows({ institutionVaults, institutionName, vaultsAdditionalInfo }),
    [institutionVaults, institutionName, vaultsAdditionalInfo],
  )

  return (
    <div className={panelInstitutionOverviewStyles.wrapper}>
      <TvlChartIntermediary vaultsTvlChartData={vaultsTvlChartData} isLoading={isLoading} />
      <Card variant="cardSecondary" className={panelInstitutionOverviewStyles.yourVaultsWrapper}>
        <Text variant="h5">Your Vaults</Text>
        <Card variant="cardPrimary">
          <Table
            rows={vaultsTableList}
            columns={vaultsListColumns}
            isLoading={isLoading}
            skeletonLines={3}
          />
        </Card>
      </Card>
    </div>
  )
}
