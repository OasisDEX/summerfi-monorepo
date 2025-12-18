'use client'

import { type FC, useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import { useChain } from '@account-kit/react'
import { Card, ERROR_TOAST_CONFIG, Table, Text, WARNING_TOAST_CONFIG } from '@summerfi/app-earn-ui'
import { type NetworkNames } from '@summerfi/app-types'
import { networkNameToSDKId } from '@summerfi/app-utils'

import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { AddWhitelistForm } from '@/features/panels/vaults/components/PanelRoleAdmin/AddWhitelistForm'
import { userAdminColumns } from '@/features/panels/vaults/components/PanelUserAdmin/columns'
import { userAdminMapper } from '@/features/panels/vaults/components/PanelUserAdmin/mapper'
import { getGrantWhitelistId, getRevokeWhitelistId } from '@/helpers/get-transaction-id'
import { useAdminAppSDK } from '@/hooks/useAdminAppSDK'
import { useSDKTransactionQueue } from '@/hooks/useSDKTransactionQueue'

import panelUserStyles from './PanelUser.module.css'

interface PanelUserAdminProps {
  whitelistedWallets: string[]
  institutionName: string
  vaultAddress: string
  network: NetworkNames
}

export const PanelUserAdmin: FC<PanelUserAdminProps> = ({
  whitelistedWallets,
  institutionName,
  vaultAddress,
  network,
}) => {
  const chainId = networkNameToSDKId(network)
  const { chain, isSettingChain } = useChain()
  const { setWhitelistedTx } = useAdminAppSDK(institutionName)
  const { addTransaction, removeTransaction, transactionQueue } = useSDKTransactionQueue()

  const isProperChain = useMemo(() => {
    return chain.id === chainId
  }, [chain.id, chainId])

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
          setWhitelistedTx({
            chainId,
            fleetCommanderAddress: vaultAddress as `0x${string}`,
            targetAddress: address as `0x${string}`,
            allowed: false,
          }),
        )
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to add transaction to queue', error)
        toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
      }
    },
    [addTransaction, chainId, setWhitelistedTx, vaultAddress],
  )

  const onGrantWhitelist = useCallback(
    ({ address }: { address: string }) => {
      const transactionId = getGrantWhitelistId({ address, chainId })

      if (whitelistedWallets.includes(address)) {
        toast.info(`Address ${address} is already whitelisted`, WARNING_TOAST_CONFIG)

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
          setWhitelistedTx({
            chainId,
            fleetCommanderAddress: vaultAddress as `0x${string}`,
            targetAddress: address as `0x${string}`,
            allowed: true,
          }),
        )
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to add transaction to queue', error)
        toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
      }
    },
    [addTransaction, chainId, setWhitelistedTx, vaultAddress, whitelistedWallets],
  )

  const rows = useMemo(
    () =>
      userAdminMapper({
        whitelistedWallets,
        transactionQueue,
        onRevokeWhitelist,
        chainId,
        disabled: !isProperChain || isSettingChain,
      }),
    [
      whitelistedWallets,
      transactionQueue,
      onRevokeWhitelist,
      chainId,
      isProperChain,
      isSettingChain,
    ],
  )

  return (
    <Card variant="cardSecondary" className={panelUserStyles.panelUserAdminWrapper}>
      <Text as="h5" variant="h5">
        User admin
      </Text>
      <Card>
        <Table
          rows={rows}
          columns={userAdminColumns}
          wrapperClassName={panelUserStyles.tableWrapper}
          tableClassName={panelUserStyles.table}
        />
      </Card>
      <Text as="h5" variant="h5">
        Add new user
      </Text>
      <Card>
        <AddWhitelistForm
          onGrantWhitelist={onGrantWhitelist}
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
      />
    </Card>
  )
}
