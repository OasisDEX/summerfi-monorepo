import { Card, Input, Table, Text } from '@summerfi/app-earn-ui'

import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { AddWhitelistForm } from '@/features/panels/vaults/components/PanelRoleAdmin/AddWhitelistForm'
import {
  activeUsersListColumns,
  whitelistedAQListColumns,
  whitelistedListColumns,
} from '@/features/panels/vaults/components/PanelUserAdmin/columns'
import { type ActiveUsersListColumns } from '@/features/panels/vaults/components/PanelUserAdmin/types'

import panelUserStyles from './PanelUser.module.css'

export const PanelUserAdminLoading = () => {
  return (
    <Card variant="cardSecondary" className={panelUserStyles.panelUserAdminWrapper}>
      <div className={panelUserStyles.titleWithInput}>
        <Text as="h5" variant="h5">
          Active Users
        </Text>
        <Input
          variant="dark"
          placeholder="Filter active users (address)"
          wrapperClassName={panelUserStyles.inputFilter}
        />
      </div>
      <Card>
        <Table<ActiveUsersListColumns>
          isLoading
          skeletonLines={4}
          rows={[]}
          columns={activeUsersListColumns}
          wrapperClassName={panelUserStyles.tableWrapper}
          tableClassName={panelUserStyles.table}
        />
      </Card>
      <div className={panelUserStyles.titleWithInput}>
        <Text as="h5" variant="h5">
          Whitelisted users
        </Text>
        <Input
          variant="dark"
          placeholder="Filter whitelisted users (address)"
          wrapperClassName={panelUserStyles.inputFilter}
        />
      </div>
      <Card>
        <Table
          isLoading
          skeletonLines={5}
          rows={[]}
          columns={whitelistedListColumns}
          wrapperClassName={panelUserStyles.tableWrapper}
          tableClassName={panelUserStyles.table}
        />
      </Card>
      <div className={panelUserStyles.titleWithInput}>
        <Text as="h5" variant="h5">
          Whitelisted AQ users
        </Text>
        <Input
          variant="dark"
          placeholder="Filter whitelisted AQ users (address)"
          wrapperClassName={panelUserStyles.inputFilter}
        />
      </div>
      <Card>
        <Table
          isLoading
          skeletonLines={4}
          rows={[]}
          columns={whitelistedAQListColumns}
          wrapperClassName={panelUserStyles.tableWrapper}
          tableClassName={panelUserStyles.table}
        />
      </Card>
      <Text as="h5" variant="h5">
        Add new user
      </Text>
      <Card>
        <AddWhitelistForm disabled />
      </Card>
      <Text as="h5" variant="h5">
        Transaction Queue
      </Text>
      <TransactionQueue transactionQueue={[]} chainId={1} isLoading />
    </Card>
  )
}
