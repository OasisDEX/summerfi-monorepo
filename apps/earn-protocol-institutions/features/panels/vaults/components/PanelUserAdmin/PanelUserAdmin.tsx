'use client'

import { type FC, useCallback, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useChain } from '@account-kit/react'
import {
  Card,
  ERROR_TOAST_CONFIG,
  Input,
  Table,
  type TableSortedColumn,
  Text,
  useUserWallet,
  WARNING_TOAST_CONFIG,
} from '@summerfi/app-earn-ui'
import { type NetworkNames } from '@summerfi/app-types'
import { chainIdToSDKNetwork, networkNameToSDKId, SortDirection } from '@summerfi/app-utils'
import { type Role } from '@summerfi/sdk-common'

import { type InstiVaultActiveUsersResponse } from '@/app/server-handlers/institution/institution-vaults/types'
import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { AddWhitelistForm } from '@/features/panels/vaults/components/PanelRoleAdmin/AddWhitelistForm'
import {
  activeUsersListColumns,
  whitelistedAQListColumns,
  whitelistedListColumns,
} from '@/features/panels/vaults/components/PanelUserAdmin/columns'
import {
  userActiveListMapper,
  whitelistedAQListMapper,
  whitelistedListMapper,
} from '@/features/panels/vaults/components/PanelUserAdmin/mapper'
import { type ActiveUsersListColumns } from '@/features/panels/vaults/components/PanelUserAdmin/types'
import { type GetInstitutionDataQuery } from '@/graphql/clients/institution/client'
import {
  getGrantAQWhitelistId,
  getGrantWhitelistId,
  getRevokeAQWhitelistId,
  getRevokeWhitelistId,
} from '@/helpers/get-transaction-id'
import { useAdminAppSDK } from '@/hooks/useAdminAppSDK'
import { useRevalidateTags } from '@/hooks/useRevalidateTags'
import { useSDKTransactionQueue } from '@/hooks/useSDKTransactionQueue'

import panelUserStyles from './PanelUser.module.css'

interface PanelUserAdminProps {
  whitelistedWallets: Role[]
  whitelistedAQWallets: { [key: string]: boolean }
  activeUsers: InstiVaultActiveUsersResponse
  institutionName: string
  vaultAddress: string
  network: NetworkNames
  institutionBasicData: GetInstitutionDataQuery | undefined
}

export const PanelUserAdmin: FC<PanelUserAdminProps> = ({
  whitelistedWallets,
  whitelistedAQWallets,
  institutionBasicData,
  institutionName,
  vaultAddress,
  network,
  activeUsers,
}) => {
  const { isLoadingAccount, userWalletAddress } = useUserWallet()
  const [activeUsersFilter, setActiveUsersFilter] = useState('')
  const [whitelistedUsersFilter, setWhitelistedUsersFilter] = useState('')
  const [whitelistedAQUsersFilter, setWhitelistedAQUsersFilter] = useState('')
  const chainId = networkNameToSDKId(network)
  const sdkNetworkName = chainIdToSDKNetwork(chainId)
  const { chain, isSettingChain } = useChain()
  const { setWhitelistedTx, setWhitelistedAQTx } = useAdminAppSDK(institutionName)
  const { addTransaction, removeTransaction, transactionQueue } = useSDKTransactionQueue()
  const { revalidateTags } = useRevalidateTags()

  const aqAddress = useMemo(() => {
    return institutionBasicData?.institution?.admiralsQuarters ?? ''
  }, [institutionBasicData])

  const [activeUsersSortConfig, setActiveUsersSortConfig] = useState<
    TableSortedColumn<ActiveUsersListColumns>
  >({
    direction: SortDirection.DESC,
    key: 'tvl',
  })

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
    ({ address }: { address: `0x${string}` }) => {
      const transactionId = getGrantWhitelistId({ address, chainId })

      if (whitelistedWallets.map((role) => role.owner).includes(address)) {
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

  const onRevokeAQWhitelist = useCallback(
    ({ address }: { address: string }) => {
      const transactionId = getRevokeAQWhitelistId({ address, chainId })

      try {
        addTransaction(
          {
            id: transactionId,
            txDescription: (
              <Text variant="p3">
                AQ&nbsp;whitelist&nbsp;from&nbsp;
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
          setWhitelistedAQTx({
            chainId,
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
    [addTransaction, chainId, setWhitelistedAQTx],
  )

  const onGrantAQWhitelist = useCallback(
    ({ address }: { address: `0x${string}` }) => {
      const transactionId = getGrantAQWhitelistId({ address, chainId })

      if (whitelistedAQWallets[address]) {
        toast.info(`Address ${address} is already whitelisted in AQ`, WARNING_TOAST_CONFIG)

        return
      }

      try {
        addTransaction(
          {
            id: transactionId,
            txDescription: (
              <Text variant="p3">
                AQ&nbsp;whitelist&nbsp;to&nbsp;
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
          setWhitelistedAQTx({
            chainId,
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
    [addTransaction, chainId, setWhitelistedAQTx, whitelistedAQWallets],
  )

  const whitelistedListRows = useMemo(
    () =>
      whitelistedListMapper({
        whitelistedWallets,
        transactionQueue,
        onRevokeWhitelist,
        chainId,
        aqAddress,
        disabled: !isProperChain || isSettingChain,
        whitelistedUsersFilter,
        userWalletAddress: isLoadingAccount ? undefined : userWalletAddress,
      }),
    [
      whitelistedWallets,
      transactionQueue,
      onRevokeWhitelist,
      chainId,
      aqAddress,
      isProperChain,
      isSettingChain,
      whitelistedUsersFilter,
      isLoadingAccount,
      userWalletAddress,
    ],
  )

  const whitelistedAQListRows = useMemo(
    () =>
      whitelistedAQListMapper({
        whitelistedAQWallets,
        transactionQueue,
        onRevokeAQWhitelist,
        chainId,
        disabled: !isProperChain || isSettingChain,
        whitelistedAQUsersFilter,
        userWalletAddress: isLoadingAccount ? undefined : userWalletAddress,
      }),
    [
      whitelistedAQWallets,
      transactionQueue,
      onRevokeAQWhitelist,
      chainId,
      isProperChain,
      isSettingChain,
      whitelistedAQUsersFilter,
      isLoadingAccount,
      userWalletAddress,
    ],
  )

  const activeUsersListRows = useMemo(
    () =>
      userActiveListMapper({
        activeUsers,
        activeUsersSortConfig,
        activeUsersFilter,
        userWalletAddress: isLoadingAccount ? undefined : userWalletAddress,
      }),
    [activeUsers, activeUsersSortConfig, activeUsersFilter, isLoadingAccount, userWalletAddress],
  )

  const onTxSuccess = () => {
    revalidateTags({
      tags: [
        `institution-vault-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${sdkNetworkName.toLowerCase()}`,
      ],
    })
  }

  const handleGrantWhitelist = ({ address }: { address: `0x${string}` }) => {
    // need to check if we need to add both whitelist and AQ whitelist
    onGrantWhitelist({ address })
    if (!whitelistedAQWallets[address]) {
      onGrantAQWhitelist({ address })
    }
  }

  return (
    <Card variant="cardSecondary" className={panelUserStyles.panelUserAdminWrapper}>
      <div className={panelUserStyles.titleWithInput}>
        <Text as="h5" variant="h5">
          Active Users
        </Text>
        <Input
          variant="dark"
          placeholder="Filter active users (address)"
          value={activeUsersFilter}
          onChange={(e) => setActiveUsersFilter(e.target.value)}
          wrapperClassName={panelUserStyles.inputFilter}
        />
      </div>
      <Card>
        <Table<ActiveUsersListColumns>
          rows={activeUsersListRows}
          columns={activeUsersListColumns}
          wrapperClassName={panelUserStyles.tableWrapper}
          tableClassName={panelUserStyles.table}
          handleSort={(nextActiveUsersSortConfig) => {
            setActiveUsersSortConfig(nextActiveUsersSortConfig)
          }}
        />
      </Card>
      <div className={panelUserStyles.titleWithInput}>
        <Text as="h5" variant="h5">
          Whitelisted users
        </Text>
        <Input
          variant="dark"
          placeholder="Filter whitelisted users (address)"
          value={whitelistedUsersFilter}
          onChange={(e) => setWhitelistedUsersFilter(e.target.value)}
          wrapperClassName={panelUserStyles.inputFilter}
        />
      </div>
      <Card>
        <Table
          rows={whitelistedListRows}
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
          value={whitelistedAQUsersFilter}
          onChange={(e) => setWhitelistedAQUsersFilter(e.target.value)}
          wrapperClassName={panelUserStyles.inputFilter}
        />
      </div>
      <Card>
        <Table
          rows={whitelistedAQListRows}
          columns={whitelistedAQListColumns}
          wrapperClassName={panelUserStyles.tableWrapper}
          tableClassName={panelUserStyles.table}
        />
      </Card>
      <Text as="h5" variant="h5">
        Add new user
      </Text>
      <Card>
        <AddWhitelistForm
          onGrantWhitelist={handleGrantWhitelist}
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
