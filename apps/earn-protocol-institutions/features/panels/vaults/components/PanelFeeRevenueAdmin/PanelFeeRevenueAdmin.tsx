import { type FC } from 'react'
import { Card, Table, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'

import { feeRevenueColumns } from './tables/fee-revenue/columns'
import { feeRevenueHistoryColumns } from './tables/history/columns'
import { thirdPartyCostsColumns } from './tables/third-party-costs/columns'

import classNames from './PanelFeeRevenueAdmin.module.css'

interface PanelFeeRevenueAdminProps {
  vaultData: SDKVaultishType
}

export const PanelFeeRevenueAdmin: FC<PanelFeeRevenueAdminProps> = ({ vaultData: _vaultData }) => {
  // const thirdPartyCostsRows = thirdPartyCostsMapper({
  //   costs: vaultData.thirdPartyCosts,
  // })

  // const feeRevenueHistoryRows = feeRevenueHistoryMapper({
  //   history: vaultData.feeRevenueHistory,
  // })

  // const feeRevenueRows = feeRevenueMapper({
  //   feeRevenue: vaultData.feeRevenue,
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
        <Table rows={[]} columns={feeRevenueColumns} />
      </Card>
      <Card variant="cardPrimary" className={classNames.panelFeeRevenueAdminCard}>
        <Text as="p" variant="p3semi">
          3rd Party Costs
        </Text>
        <Table rows={[]} columns={thirdPartyCostsColumns} />
      </Card>
      <Card className={classNames.panelFeeRevenueAdminCard} style={{ background: 'unset' }}>
        <Text as="p" variant="p1semi">
          History
        </Text>
        <Table rows={[]} columns={feeRevenueHistoryColumns} />
      </Card>
    </Card>
  )
}
