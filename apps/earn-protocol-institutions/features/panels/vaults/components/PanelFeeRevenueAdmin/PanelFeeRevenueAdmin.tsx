import { type FC } from 'react'
import { Card, Table, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'

import { type InstitutionVaultFeeRevenueData } from '@/types/institution-data'

import { feeRevenueColumns } from './tables/fee-revenue/columns'
import { feeRevenueMapper } from './tables/fee-revenue/mapper'
import { feeRevenueHistoryColumns } from './tables/history/columns'
import { feeRevenueHistoryMapper } from './tables/history/mapper'
import { thirdPartyCostsColumns } from './tables/third-party-costs/columns'
import { thirdPartyCostsMapper } from './tables/third-party-costs/mapper'

import classNames from './PanelFeeRevenueAdmin.module.css'

interface PanelFeeRevenueAdminProps {
  vaultData: SDKVaultishType
  feeRevenueData: InstitutionVaultFeeRevenueData
}

export const PanelFeeRevenueAdmin: FC<PanelFeeRevenueAdminProps> = ({
  vaultData: _vaultData,
  feeRevenueData,
}) => {
  const thirdPartyCostsRows = thirdPartyCostsMapper({
    costs: feeRevenueData.thirdPartyCosts,
  })

  const feeRevenueHistoryRows = feeRevenueHistoryMapper({
    feeRevenueHistory: feeRevenueData.feeRevenueHistory,
  })

  const feeRevenueRows = feeRevenueMapper({
    feeRevenue: feeRevenueData.feeRevenue,
  })

  return (
    <Card variant="cardSecondary" className={classNames.panelFeeRevenueAdminWrapper}>
      <Text as="h5" variant="h5">
        Fee & revenue admin
      </Text>
      <Card variant="cardPrimary" className={classNames.panelFeeRevenueAdminCard}>
        <Text as="p" variant="p3semi">
          Fee Revenue
        </Text>
        <Table rows={feeRevenueRows} columns={feeRevenueColumns} />
      </Card>
      <Card variant="cardPrimary" className={classNames.panelFeeRevenueAdminCard}>
        <Text as="p" variant="p3semi">
          3rd Party Costs
        </Text>
        <Table rows={thirdPartyCostsRows} columns={thirdPartyCostsColumns} />
      </Card>
      <Card className={classNames.panelFeeRevenueAdminCard} style={{ background: 'unset' }}>
        <Text as="p" variant="p1semi">
          History
        </Text>
        <Table rows={feeRevenueHistoryRows} columns={feeRevenueHistoryColumns} />
      </Card>
    </Card>
  )
}
