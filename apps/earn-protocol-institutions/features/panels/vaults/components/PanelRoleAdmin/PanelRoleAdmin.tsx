'use client'

import { type FC, useMemo } from 'react'
import { Card, Table, Text } from '@summerfi/app-earn-ui'

import { useAdminAppSDK } from '@/hooks/useAdminAppSDK'
import { useSDKTransactionQueue } from '@/hooks/useSDKTransactionQueue'
import { type InstitutionVaultRole } from '@/types/institution-data'

import { roleAdminColumns } from './columns'
import { roleAdminMapper } from './mapper'

import styles from './PanelRoleAdmin.module.css'

interface PanelRoleAdminProps {
  roles: InstitutionVaultRole[]
  institutionName: string
}

export const PanelRoleAdmin: FC<PanelRoleAdminProps> = ({ roles, institutionName }) => {
  const { grantContractSpecificRole, revokeContractSpecificRole, getStakedBalance } =
    useAdminAppSDK(institutionName)
  const { addTransaction, removeTransaction, transactionQueue } = useSDKTransactionQueue()

  const rows = useMemo(
    () =>
      roleAdminMapper({
        roles,
      }),
    [roles],
  )

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
