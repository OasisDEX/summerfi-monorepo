import { Card, Table, Text } from '@summerfi/app-earn-ui'

import { feeRevenueColumns } from './tables/fee-revenue/columns'
import { thirdPartyCostsColumns } from './tables/third-party-costs/columns'

import classNames from './PanelFeeRevenueAdmin.module.css'

export const PanelFeeRevenueAdminLoading = () => {
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
          isLoading
          rows={[]}
          skeletonLines={1}
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
          isLoading
          rows={[]}
          skeletonLines={1}
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
    </Card>
  )
}
