'use client'

import { type FC, useCallback, useMemo } from 'react'
import { Card, Table, Text } from '@summerfi/app-earn-ui'
import { type NetworkNames } from '@summerfi/app-types'
import { networkNameToSDKId } from '@summerfi/app-utils'
import { ContractSpecificRoleName } from '@summerfi/sdk-common'

import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { AddNewRoleForm } from '@/features/panels/vaults/components/PanelRoleAdmin/AddNewRoleForm'
import {
  getGrantContractRoleTransactionId,
  getRevokeContractRoleTransactionId,
} from '@/helpers/get-transaction-id'
import { contractSpecificRolesToHuman } from '@/helpers/wallet-roles'
import { useAdminAppSDK } from '@/hooks/useAdminAppSDK'
import { useSDKTransactionQueue } from '@/hooks/useSDKTransactionQueue'
import { type InstitutionVaultRole } from '@/types/institution-data'

import { roleAdminColumns } from './columns'
import { roleAdminMapper } from './mapper'

import styles from './PanelRoleAdmin.module.css'

interface PanelRoleAdminProps {
  roles: InstitutionVaultRole[]
  institutionName: string
  vaultAddress: string
  network: NetworkNames
}

export const PanelRoleAdmin: FC<PanelRoleAdminProps> = ({
  roles,
  institutionName,
  vaultAddress,
  network,
}) => {
  const { grantContractSpecificRole, revokeContractSpecificRole } = useAdminAppSDK(institutionName)
  const { addTransaction, removeTransaction, transactionQueue } = useSDKTransactionQueue()
  const chainId = networkNameToSDKId(network)

  const onRevokeContractSpecificRole = useCallback(
    ({ address, role }: InstitutionVaultRole) => {
      const transactionId = getRevokeContractRoleTransactionId({ address, role, chainId })

      try {
        addTransaction(
          {
            id: transactionId,
            txDescription: (
              <Text variant="p3">
                Revoke&nbsp;
                <Text as="span" variant="p3semi">
                  {contractSpecificRolesToHuman(role)}
                </Text>
                &nbsp; role from&nbsp;
                <Text as="span" variant="p3semi" style={{ fontFamily: 'monospace' }}>
                  {address}
                </Text>
              </Text>
            ),
          },
          revokeContractSpecificRole({
            contractAddress: vaultAddress,
            chainId,
            role: ContractSpecificRoleName[role],
            targetAddress: address,
          }),
        )
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to add transaction to queue', error)
      }
    },
    [addTransaction, chainId, revokeContractSpecificRole, vaultAddress],
  )

  const onGrantContractSpecificRole = useCallback(
    ({ address, role }: InstitutionVaultRole) => {
      const transactionId = getGrantContractRoleTransactionId({ address, role, chainId })

      try {
        addTransaction(
          {
            id: transactionId,
            txDescription: (
              <Text variant="p3">
                Grant&nbsp;
                <Text as="span" variant="p3semi">
                  {contractSpecificRolesToHuman(role)}
                </Text>
                &nbsp;role to&nbsp;
                <Text as="span" variant="p3semi" style={{ fontFamily: 'monospace' }}>
                  {address}
                </Text>
              </Text>
            ),
          },
          grantContractSpecificRole({
            contractAddress: vaultAddress,
            chainId,
            role: ContractSpecificRoleName[role],
            targetAddress: address,
          }),
        )
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to add transaction to queue', error)
      }
    },
    [addTransaction, chainId, grantContractSpecificRole, vaultAddress],
  )

  const rows = useMemo(
    () =>
      roleAdminMapper({
        roles,
        transactionQueue,
        onRevokeContractSpecificRole,
        chainId,
      }),
    [roles, transactionQueue, onRevokeContractSpecificRole, chainId],
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
      <Text as="h5" variant="h5">
        Add new role
      </Text>
      <Card>
        <AddNewRoleForm onAddRole={onGrantContractSpecificRole} />
      </Card>
      <Text as="h5" variant="h5">
        Transaction Queue
      </Text>
      <TransactionQueue
        transactionQueue={transactionQueue}
        chainId={chainId}
        removeTransaction={removeTransaction}
      />
    </Card>
  )
}
