import {
  Button,
  Icon,
  TableCellNodes,
  TableCellText,
  type TableSortedColumn,
  Tooltip,
} from '@summerfi/app-earn-ui'
import { formatCryptoBalance } from '@summerfi/app-utils'
import { type Role } from '@summerfi/sdk-common'
import clsx from 'clsx'
import dayjs from 'dayjs'

import { type InstiVaultActiveUsersResponse } from '@/app/server-handlers/institution/institution-vaults/types'
import { CHART_TIMESTAMP_FORMAT_SHORT } from '@/features/charts/helpers'
import { type ActiveUsersListColumns } from '@/features/panels/vaults/components/PanelUserAdmin/types'
import { getRevokeWhitelistId } from '@/helpers/get-transaction-id'
import { type SDKTransactionItem } from '@/hooks/useSDKTransactionQueue'

import styles from './PanelUser.module.css'

type UserMapperParams = {
  whitelistedWallets: Role[]
  transactionQueue: SDKTransactionItem[]
  onRevokeWhitelist: (params: { address: string }) => void
  chainId: number
  disabled?: boolean
  whitelistedUsersFilter: string
  userWalletAddress?: string
}

export const userListMapper = ({
  whitelistedWallets,
  transactionQueue,
  onRevokeWhitelist,
  chainId,
  disabled = false,
  whitelistedUsersFilter,
  userWalletAddress,
}: UserMapperParams) => {
  return whitelistedWallets
    .filter((wallet) => {
      return whitelistedUsersFilter
        ? wallet.owner.toLowerCase().includes(whitelistedUsersFilter.toLowerCase())
        : true
    })
    .map((role) => {
      const { owner: address } = role
      const revokeId = getRevokeWhitelistId({ address, chainId })
      const idDisabled = transactionQueue.some((tx) => tx.id === revokeId) || disabled
      const isCurrentUser = address.toLowerCase() === userWalletAddress?.toLowerCase()

      return {
        content: {
          address: (
            <TableCellNodes
              className={clsx(styles.tableCellAddress, {
                [styles.currentUser]: isCurrentUser,
              })}
            >
              {isCurrentUser ? (
                <Tooltip
                  tooltip="Your currently connected address"
                  tooltipWrapperStyles={{ minWidth: '290px' }}
                >
                  <span>{address}</span>
                </Tooltip>
              ) : (
                <span>{address}</span>
              )}
            </TableCellNodes>
          ),
          action: (
            <TableCellText style={{ marginLeft: '40px', gap: 'var(--spacing-space-small)' }}>
              <Button
                variant="unstyled"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                onClick={() => onRevokeWhitelist({ address })}
                disabled={idDisabled}
              >
                <Icon
                  iconName="trash"
                  size={16}
                  className={styles.trashButton}
                  style={{
                    opacity: idDisabled ? 0.5 : 1,
                  }}
                />
              </Button>
            </TableCellText>
          ),
        },
      }
    })
}

export const userActiveListMapper = ({
  activeUsers,
  activeUsersSortConfig,
  activeUsersFilter,
  userWalletAddress,
}: {
  activeUsers: InstiVaultActiveUsersResponse
  activeUsersSortConfig: TableSortedColumn<ActiveUsersListColumns>
  activeUsersFilter: string
  userWalletAddress?: string
}) => {
  return activeUsers
    .filter((userData) =>
      activeUsersFilter
        ? userData.account.id.toLowerCase().includes(activeUsersFilter.toLowerCase())
        : true,
    )
    .sort((a, b) => {
      const { key } = activeUsersSortConfig
      const direction = activeUsersSortConfig.direction === 'ASC' ? 1 : -1

      if (key === 'address') {
        return a.account.id.localeCompare(b.account.id) * direction
      }
      if (key === 'tvl') {
        return (a.inputTokenDepositsNormalized - b.inputTokenDepositsNormalized) * direction
      }
      if (key === 'first-deposit') {
        const aFirst = Math.min(...a.firstDeposit.map((d) => d.timestamp))
        const bFirst = Math.min(...b.firstDeposit.map((d) => d.timestamp))

        return (aFirst - bFirst) * direction
      }
      const aLast = Math.max(
        ...a.latestDeposit.map((d) => d.timestamp),
        ...a.latestWithdrawal.map((w) => w.timestamp),
      )
      const bLast = Math.max(
        ...b.latestDeposit.map((d) => d.timestamp),
        ...b.latestWithdrawal.map((w) => w.timestamp),
      )

      return (aLast - bLast) * direction
    })
    .map((userData) => {
      const firstDeposit = userData.firstDeposit[0]
        ? dayjs(userData.firstDeposit[0].timestamp * 1000).format(CHART_TIMESTAMP_FORMAT_SHORT)
        : 'n/a'
      const lastActivityRaw = Math.max(
        ...userData.latestDeposit.map((d) => d.timestamp),
        ...userData.latestWithdrawal.map((w) => w.timestamp),
      )
      const lastActivity =
        lastActivityRaw > 0
          ? dayjs(lastActivityRaw * 1000).format(CHART_TIMESTAMP_FORMAT_SHORT)
          : 'n/a'
      const isCurrentUser = userData.account.id.toLowerCase() === userWalletAddress?.toLowerCase()

      return {
        content: {
          address: (
            <TableCellNodes
              className={clsx(styles.tableCellAddress, {
                [styles.currentUser]: isCurrentUser,
              })}
            >
              {isCurrentUser ? (
                <Tooltip
                  tooltip="Your currently connected address"
                  tooltipWrapperStyles={{ minWidth: '290px' }}
                >
                  <span>{userData.account.id}</span>
                </Tooltip>
              ) : (
                <span>{userData.account.id}</span>
              )}
            </TableCellNodes>
          ),
          tvl: (
            <TableCellText style={{ marginLeft: '40px', gap: 'var(--spacing-space-small)' }}>
              {formatCryptoBalance(userData.inputTokenDepositsNormalized)}
            </TableCellText>
          ),
          'first-deposit': (
            <TableCellText style={{ marginLeft: '40px', gap: 'var(--spacing-space-small)' }}>
              {firstDeposit}
            </TableCellText>
          ),
          'last-activity': (
            <TableCellText style={{ marginLeft: '40px', gap: 'var(--spacing-space-small)' }}>
              {lastActivity}
            </TableCellText>
          ),
        },
      }
    })
}
