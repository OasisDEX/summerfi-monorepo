import { Card, Table, Text } from '@summerfi/app-earn-ui'
import { InstitutionRoles } from '@summerfi/app-types'

import { roleAdminColumns } from './columns'
import { roleAdminMapper } from './mapper'
import { type RoleAdmin } from './types'

import styles from './PanelRoleAdmin.module.css'

const dummyRows: RoleAdmin[] = [
  {
    id: '1',
    role: InstitutionRoles.GENERAL_ADMIN,
    address: '0x1234567890123456789012345678901234567890',
    lastUpdated: 1735689600000,
  },
  {
    id: '2',
    role: InstitutionRoles.RISK_MANAGER,
    address: '0x1234567890123456789012345678901234567890',
    lastUpdated: 1735689600000,
  },
  {
    id: '3',
    role: InstitutionRoles.MARKET_ALLOCATOR,
    address: '0x1234567890123456789012345678901234567890',
    lastUpdated: 1735689600000,
  },
]

export const PanelRoleAdmin = () => {
  const editHandler = (item: RoleAdmin) => {
    // TODO: Implement edit handler
    // eslint-disable-next-line no-console
    console.log(item)
  }

  const rows = roleAdminMapper({ rawData: dummyRows, onEdit: editHandler })

  return (
    <Card variant="cardSecondary" className={styles.panelRoleAdminWrapper}>
      <Text as="h5" variant="h5">
        Roles
      </Text>
      <Card>
        <Table
          rows={rows}
          columns={roleAdminColumns}
          wrapperClassName={styles.tableWrapper}
          tableClassName={styles.table}
        />
      </Card>
    </Card>
  )
}
