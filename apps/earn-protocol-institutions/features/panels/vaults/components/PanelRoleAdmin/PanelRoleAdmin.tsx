import { type FC, useCallback, useMemo } from 'react'
import { Card, Table, Text } from '@summerfi/app-earn-ui'

import { type InstitutionVaultRole, type InstitutionVaultRoles } from '@/types/institution-data'

import { roleAdminColumns } from './columns'
import { roleAdminMapper } from './mapper'

import styles from './PanelRoleAdmin.module.css'

interface PanelRoleAdminProps {
  roles: InstitutionVaultRoles
}

export const PanelRoleAdmin: FC<PanelRoleAdminProps> = ({ roles }) => {
  const onEdit = useCallback((item: InstitutionVaultRole) => {
    // TODO: Implement edit handler
    // eslint-disable-next-line no-console
    console.log(item)
  }, [])

  const rows = useMemo(() => roleAdminMapper({ roles, onEdit }), [roles, onEdit])

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
