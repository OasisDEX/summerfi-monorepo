'use client'

import { type FC, useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import { useChain } from '@account-kit/react'
import { Card, ERROR_TOAST_CONFIG, Table, Text, useUserWallet } from '@summerfi/app-earn-ui'
import { type NetworkNames } from '@summerfi/app-types'
import { chainIdToSDKNetwork, networkNameToSDKId } from '@summerfi/app-utils'
import { ContractSpecificRoleName } from '@summerfi/sdk-common'

import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { AddNewRoleForm } from '@/features/panels/vaults/components/PanelRoleAdmin/AddNewRoleForm'
import {
  getGrantContractRoleTransactionId,
  getRevokeContractRoleTransactionId,
} from '@/helpers/get-transaction-id'
import { contractSpecificRolesToHuman } from '@/helpers/wallet-roles'
import { useAdminAppSDK } from '@/hooks/useAdminAppSDK'
import { useRevalidateTags } from '@/hooks/useRevalidateTags'
import { useSDKTransactionQueue } from '@/hooks/useSDKTransactionQueue'
import { type InstitutionVaultRole } from '@/types/institution-data'

import { roleAdminColumns } from './columns'
import { roleAdminMapper } from './mapper'

import panelRoleStyles from './PanelRoleAdmin.module.css'

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
  const { isLoadingAccount, userWalletAddress } = useUserWallet()
  const { grantContractSpecificRole, revokeContractSpecificRole } = useAdminAppSDK(institutionName)
  const { addTransaction, removeTransaction, transactionQueue } = useSDKTransactionQueue()
  const chainId = networkNameToSDKId(network)
  const sdkNetworkName = chainIdToSDKNetwork(chainId)
  const { chain, isSettingChain } = useChain()
  const { revalidateTags } = useRevalidateTags()

  const isProperChain = useMemo(() => {
    return chain.id === chainId
  }, [chain.id, chainId])

  const onRevokeContractSpecificRole = useCallback(
    ({ address, role }: InstitutionVaultRole) => {
      const transactionId = getRevokeContractRoleTransactionId({ address, role, chainId })

      try {
        addTransaction(
          {
            id: transactionId,
            txDescription: (
              <Text variant="p3">
                <Text as="span" variant="p3semi">
                  {contractSpecificRolesToHuman(role)}
                </Text>
                &nbsp;role&nbsp;from&nbsp;
                <Text as="span" variant="p4semi" style={{ fontFamily: 'monospace' }}>
                  {address}
                </Text>
              </Text>
            ),
            txLabel: {
              label: 'Revoke',
              charge: 'negative',
            },
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
        toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
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
                <Text as="span" variant="p3semi">
                  {contractSpecificRolesToHuman(role)}
                </Text>
                &nbsp;role to&nbsp;
                <Text as="span" variant="p4semi" style={{ fontFamily: 'monospace' }}>
                  {address}
                </Text>
              </Text>
            ),
            txLabel: {
              label: 'Grant',
              charge: 'positive',
            },
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
        toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
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
        disabled: !isProperChain || isSettingChain,
        userWalletAddress: isLoadingAccount ? undefined : userWalletAddress,
      }),
    [
      roles,
      transactionQueue,
      onRevokeContractSpecificRole,
      chainId,
      isProperChain,
      isSettingChain,
      isLoadingAccount,
      userWalletAddress,
    ],
  )

  const onTxSuccess = () => {
    revalidateTags({
      tags: [
        `institution-vault-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${sdkNetworkName.toLowerCase()}`,
      ],
    })
  }

  return (
    <Card variant="cardSecondary" className={panelRoleStyles.panelRoleAdminWrapper}>
      <Text as="h5" variant="h5">
        Roles
      </Text>
      <Card>
        <Table
          rows={rows}
          columns={roleAdminColumns}
          wrapperClassName={panelRoleStyles.tableWrapper}
          tableClassName={panelRoleStyles.table}
        />
      </Card>
      <Text as="h5" variant="h5">
        Add new role
      </Text>
      <Card>
        <AddNewRoleForm
          onAddRole={onGrantContractSpecificRole}
          disabled={!isProperChain || isSettingChain}
        />
      </Card>
      <Text as="h5" variant="h5">
        Transaction Queue
      </Text>
      <TransactionQueue
        transactionQueue={transactionQueue}
        chainId={chainId}
        removeTransaction={removeTransaction}
        onTxSuccess={onTxSuccess}
      />
    </Card>
  )
}
