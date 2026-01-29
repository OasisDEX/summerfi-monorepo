import { Card, Input, Table, Text } from '@summerfi/app-earn-ui'

import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { AddNewRoleForm } from '@/features/panels/vaults/components/PanelRoleAdmin/AddNewRoleForm'

import { roleAdminColumns } from './columns'

import panelRoleStyles from './PanelRoleAdmin.module.css'

export const PanelRoleAdminLoading = () => {
  return (
    <Card variant="cardSecondary" className={panelRoleStyles.panelRoleAdminWrapper}>
      <div className={panelRoleStyles.titleWithInput}>
        <Text as="h5" variant="h5">
          Roles
        </Text>
        <Input
          variant="dark"
          placeholder="Filter roles (address, role)"
          wrapperClassName={panelRoleStyles.inputFilter}
        />
      </div>
      <Card>
        <Table
          isLoading
          skeletonLines={4}
          rows={[]}
          columns={roleAdminColumns}
          wrapperClassName={panelRoleStyles.tableWrapper}
          tableClassName={panelRoleStyles.table}
        />
      </Card>
      <Text as="h5" variant="h5">
        Add new role
      </Text>
      <Card>
        <AddNewRoleForm disabled />
      </Card>
      <Text as="h5" variant="h5">
        Transaction Queue
      </Text>
      <TransactionQueue transactionQueue={[]} chainId={1} isLoading />
    </Card>
  )
}
