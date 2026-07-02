'use client'

import { type FC, useCallback, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import {
  Card,
  ERROR_TOAST_CONFIG,
  Input,
  Table,
  Text,
  useEarnProtocolChain,
  useEarnProtocolWallet,
} from '@summerfi/app-earn-ui'
import { type NetworkNames } from '@summerfi/app-types'
import { chainIdToSDKNetwork, networkNameToSDKId } from '@summerfi/app-utils'
import { InstiContractRoles } from '@summerfi/sdk-common'

import { SwitchChainButton } from '@/components/molecules/SwitchChainButton/SwitchChainButton'
import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { useTransactionQueue } from '@/contexts/TransactionQueueContext/TransactionQueueContext'
import { AddNewRoleForm } from '@/features/panels/vaults/components/PanelRoleAdmin/AddNewRoleForm'
import {
  getGrantContractRoleTransactionId,
  getRevokeContractRoleTransactionId,
} from '@/helpers/get-transaction-id'
import { contractSpecificRolesToHuman } from '@/helpers/wallet-roles'
import { useAdminAppSDK } from '@/hooks/useAdminAppSDK'
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
  const [rolesUsersFilter, setRolesUsersFilter] = useState('')
  const { grantContractSpecificRole, revokeContractSpecificRole } = useAdminAppSDK(institutionName)
  const { addTransaction, transactionQueue } = useTransactionQueue()
  const chainId = networkNameToSDKId(network)
  const sdkNetworkName = chainIdToSDKNetwork(chainId)
  const { address: userWalletAddress, isLoadingAccount } = useEarnProtocolWallet()
  const { chain, isSettingChain } = useEarnProtocolChain()

  const revalidateTags = useMemo(
    () => [
      `vault-roles-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${sdkNetworkName.toLowerCase()}`,
    ],
    [institutionName, vaultAddress, sdkNetworkName],
  )

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
            txDescription: `${contractSpecificRolesToHuman(role)} role from ${address}`,
            txLabel: {
              label: 'Revoke',
              charge: 'negative',
            },
            chainId,
            vaultAddress,
            revalidateTags,
          },
          revokeContractSpecificRole({
            contractAddress: vaultAddress,
            chainId,
            role: InstiContractRoles[role],
            targetAddress: address,
          }),
        )
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to add transaction to queue', error)
        toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
      }
    },
    [addTransaction, chainId, revalidateTags, revokeContractSpecificRole, vaultAddress],
  )

  const onGrantContractSpecificRole = useCallback(
    ({ address, role }: InstitutionVaultRole) => {
      const transactionId = getGrantContractRoleTransactionId({ address, role, chainId })

      try {
        addTransaction(
          {
            id: transactionId,
            txDescription: `${contractSpecificRolesToHuman(role)} role to ${address}`,
            txLabel: {
              label: 'Grant',
              charge: 'positive',
            },
            chainId,
            vaultAddress,
            revalidateTags,
          },
          grantContractSpecificRole({
            contractAddress: vaultAddress,
            chainId,
            role: InstiContractRoles[role],
            targetAddress: address,
          }),
        )
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to add transaction to queue', error)
        toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
      }
    },
    [addTransaction, chainId, grantContractSpecificRole, revalidateTags, vaultAddress],
  )

  const rows = useMemo(
    () =>
      roleAdminMapper({
        roles,
        transactionQueue,
        onRevokeContractSpecificRole,
        chainId,
        disabled: !isProperChain || isSettingChain,
        rolesUsersFilter,
        userWalletAddress: isLoadingAccount ? undefined : userWalletAddress,
      }),
    [
      roles,
      transactionQueue,
      onRevokeContractSpecificRole,
      chainId,
      isProperChain,
      isSettingChain,
      rolesUsersFilter,
      isLoadingAccount,
      userWalletAddress,
    ],
  )

  return (
    <Card variant="cardSecondary" className={panelRoleStyles.panelRoleAdminWrapper}>
      <SwitchChainButton requiredChainId={chainId} />
      <div className={panelRoleStyles.titleWithInput}>
        <Text as="h5" variant="h5">
          Roles
        </Text>
        <Input
          variant="dark"
          placeholder="Filter roles (address, role)"
          value={rolesUsersFilter}
          onChange={(e) => setRolesUsersFilter(e.target.value)}
          wrapperClassName={panelRoleStyles.inputFilter}
        />
      </div>
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
      <TransactionQueue />
    </Card>
  )
}
