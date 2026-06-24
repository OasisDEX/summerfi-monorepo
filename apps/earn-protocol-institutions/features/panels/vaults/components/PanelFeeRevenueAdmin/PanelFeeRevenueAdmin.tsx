'use client'
import { type FC } from 'react'
import { Card, Table, Text } from '@summerfi/app-earn-ui'

import { feeRevenueMapper } from '@/features/panels/vaults/components/PanelFeeRevenueAdmin/tables/fee-revenue/mapper'
import { thirdPartyCostsMapper } from '@/features/panels/vaults/components/PanelFeeRevenueAdmin/tables/third-party-costs/mapper'
import { type InstitutionVaultFeeRevenueItem } from '@/types/institution-data'

import { feeRevenueColumns } from './tables/fee-revenue/columns'
// import { feeRevenueHistoryColumns } from './tables/history/columns'
// import { feeRevenueHistoryMapper } from './tables/history/mapper'
import { thirdPartyCostsColumns } from './tables/third-party-costs/columns'

import classNames from './PanelFeeRevenueAdmin.module.css'

interface PanelFeeRevenueAdminProps {
  // Fee rows to display — a single "Vault AUM Fee" for standard vaults, or "Management Fee" +
  // "Performance Fee" for RWA vaults (read on-chain). `aumFee` is a decimal fraction (0.01 = 1%).
  feeRevenue: InstitutionVaultFeeRevenueItem[]
}

export const PanelFeeRevenueAdmin: FC<PanelFeeRevenueAdminProps> = ({ feeRevenue }) => {
  const thirdPartyCostsRows = thirdPartyCostsMapper({
    rawData: [],
  })

  const feeRevenueRows = feeRevenueMapper({
    rawData: feeRevenue,
  })

  // const feeRevenueHistoryRows = feeRevenueHistoryMapper({
  //   feeRevenueHistory: [],
  // })

  return (
    <Card variant="cardSecondary" className={classNames.panelFeeRevenueAdminWrapper}>
      <Text as="h5" variant="h5">
        Fee & revenue admin
      </Text>
      <Card variant="cardPrimary" className={classNames.panelFeeRevenueAdminCard}>
        <Text as="p" variant="p3semi">
          Fee Revenue
        </Text>
        <Table
          rows={feeRevenueRows}
          columns={feeRevenueColumns}
          wrapperClassName={classNames.tableWrapper}
          tableClassName={classNames.table}
        />
      </Card>
      <Card variant="cardPrimary" className={classNames.panelFeeRevenueAdminCard}>
        <Text as="p" variant="p3semi">
          3rd Party Costs
        </Text>
        <Table
          rows={thirdPartyCostsRows}
          columns={thirdPartyCostsColumns}
          wrapperClassName={classNames.tableWrapper}
          tableClassName={classNames.table}
          noRowsContent={
            <Text as="p" variant="p2">
              No third party costs.
            </Text>
          }
        />
      </Card>
      {/* <Card className={classNames.panelFeeRevenueAdminCard} style={{ background: 'unset' }}>
        <Text as="p" variant="p1semi">
          History
        </Text>
        <Table
          rows={feeRevenueHistoryRows}
          columns={feeRevenueHistoryColumns}
          wrapperClassName={classNames.tableWrapper}
          tableClassName={classNames.table}
        />
      </Card> */}
    </Card>
  )
}
