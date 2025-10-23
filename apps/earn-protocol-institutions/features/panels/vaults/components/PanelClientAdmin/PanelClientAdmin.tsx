'use client'

import { type FC, useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import { Card, Table, Text, WARNING_TOAST_CONFIG } from '@summerfi/app-earn-ui'
import { type NetworkNames } from '@summerfi/app-types'
import { networkNameToSDKId } from '@summerfi/app-utils'
import { ContractSpecificRoleName } from '@summerfi/sdk-common'

import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { clientAdminColumns } from '@/features/panels/vaults/components/PanelClientAdmin/columns'
import { clientAdminMapper } from '@/features/panels/vaults/components/PanelClientAdmin/mapper'
import { AddNewRoleForm } from '@/features/panels/vaults/components/PanelRoleAdmin/AddNewRoleForm'
import { getGrantWhitelistId, getRevokeWhitelistId } from '@/helpers/get-transaction-id'
import { useAdminAppSDK } from '@/hooks/useAdminAppSDK'
import { useSDKTransactionQueue } from '@/hooks/useSDKTransactionQueue'

import panelClientStyles from './PanelClient.module.css'

interface PanelClientAdminProps {
  whitelistedWallets: string[]
  institutionName: string
  vaultAddress: string
  network: NetworkNames
}

export const PanelClientAdmin: FC<PanelClientAdminProps> = ({
  whitelistedWallets,
  institutionName,
  vaultAddress,
  network,
}) => {
  const { grantContractSpecificRole, revokeContractSpecificRole } = useAdminAppSDK(institutionName)
  const { addTransaction, removeTransaction, transactionQueue } = useSDKTransactionQueue()
  const chainId = networkNameToSDKId(network)

  const onRevokeWhitelist = useCallback(
    ({ address }: { address: string }) => {
      const transactionId = getRevokeWhitelistId({ address, chainId })

      try {
        addTransaction(
          {
            id: transactionId,
            txDescription: (
              <Text variant="p3">
                whitelist&nbsp;from&nbsp;
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
            role: ContractSpecificRoleName.WHITELISTED_ROLE,
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

  const onGrantWhitelist = useCallback(
    ({ address }: { address: string }) => {
      const transactionId = getGrantWhitelistId({ address, chainId })

      if (whitelistedWallets.includes(address)) {
        toast.error(`Address ${address} is already whitelisted`, WARNING_TOAST_CONFIG)

        return
      }

      try {
        addTransaction(
          {
            id: transactionId,
            txDescription: (
              <Text variant="p3">
                whitelist&nbsp;to&nbsp;
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
            role: ContractSpecificRoleName.WHITELISTED_ROLE,
            targetAddress: address,
          }),
        )
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to add transaction to queue', error)
      }
    },
    [addTransaction, chainId, grantContractSpecificRole, vaultAddress, whitelistedWallets],
  )

  const rows = useMemo(
    () =>
      clientAdminMapper({
        whitelistedWallets,
        transactionQueue,
        onRevokeWhitelist,
        chainId,
      }),
    [whitelistedWallets, transactionQueue, onRevokeWhitelist, chainId],
  )

  return (
    <Card variant="cardSecondary" className={panelClientStyles.panelClientAdminWrapper}>
      <Text as="h5" variant="h5">
        Client admin
      </Text>
      <Card>
        <Table
          rows={rows}
          columns={clientAdminColumns}
          wrapperClassName={panelClientStyles.tableWrapper}
          tableClassName={panelClientStyles.table}
        />
      </Card>
      <Text as="h5" variant="h5">
        Add new client
      </Text>
      <Card>
        <AddNewRoleForm onAddRole={onGrantWhitelist} staticRole="WHITELISTED_ROLE" />
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
