'use client'

import { type FC, useCallback, useMemo } from 'react'
import { Card, Table, Text } from '@summerfi/app-earn-ui'

import { EditSummary } from '@/components/molecules/EditSummary/EditSummary'
import { type InstitutionVaultRole, type InstitutionVaultRoles } from '@/types/institution-data'

import { roleAdminColumns } from './columns'
import { roleAdminMapper } from './mapper'

import styles from './PanelRoleAdmin.module.css'

const change = [
  {
    title: 'Risk Manager Address',
    from: '0xC3P0F36260817d1c78C471406BdE482177a1935071',
    to: '0xC3P0F36260817d1c78C471406BdE482177a1935071',
  },
  {
    title: 'Market Allocator Address',
    from: '0xC3P0F36260817d1c78C471406BdE482177a1935071',
    to: '0xC3P0F36260817d1c78C471406BdE482177a1935071',
  },
]

interface PanelRoleAdminProps {
  roles: InstitutionVaultRoles
}

export const PanelRoleAdmin: FC<PanelRoleAdminProps> = ({ roles }) => {
  const onEdit = useCallback((item: InstitutionVaultRole) => {
    // TODO: Implement edit handler
    // eslint-disable-next-line no-console
    console.log(item)
  }, [])

  const onCancel = useCallback(() => {
    // TODO: Implement cancel handler
    // eslint-disable-next-line no-console
    console.log('cancel')
  }, [])

  const onConfirm = useCallback(() => {
    // TODO: Implement confirm handler
    // eslint-disable-next-line no-console
    console.log('confirm')
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

      <EditSummary title="Summary" change={change} onCancel={onCancel} onConfirm={onConfirm} />
    </Card>
  )
}
