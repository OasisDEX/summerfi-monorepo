import { Button, Icon, TableCellNodes, TableCellText, Tooltip } from '@summerfi/app-earn-ui'
import clsx from 'clsx'

import { getRevokeContractRoleTransactionId } from '@/helpers/get-transaction-id'
import { contractSpecificRolesToHuman } from '@/helpers/wallet-roles'
import { type SDKTransactionItem } from '@/hooks/useSDKTransactionQueue'
import { type InstitutionVaultRole, type InstitutionVaultRoleType } from '@/types/institution-data'

import styles from './PanelRoleAdmin.module.css'

type RoleAdminMapperParams = {
  roles: InstitutionVaultRole[]
  transactionQueue: SDKTransactionItem[]
  onRevokeContractSpecificRole: (params: InstitutionVaultRole) => void
  chainId: number
  disabled?: boolean
  userWalletAddress?: string
  rolesUsersFilter?: string
}

export const roleAdminMapper = ({
  roles,
  transactionQueue,
  onRevokeContractSpecificRole,
  chainId,
  disabled = false,
  userWalletAddress,
  rolesUsersFilter,
}: RoleAdminMapperParams) => {
  return roles
    .filter((role) => {
      if (!rolesUsersFilter) return true

      const filter = rolesUsersFilter.toLowerCase()
      const addressMatch = role.address.toLowerCase().includes(filter)
      const roleMatch = contractSpecificRolesToHuman(role.role as InstitutionVaultRoleType)
        .toLowerCase()
        .includes(filter)

      return addressMatch || roleMatch
    })
    .map(({ address, role }) => {
      const revokeId = getRevokeContractRoleTransactionId({ address, role, chainId })
      const idDisabled = transactionQueue.some((tx) => tx.id === revokeId) || disabled
      const isCurrentUser = address.toLowerCase() === userWalletAddress?.toLowerCase()

      return {
        content: {
          role: (
            <TableCellText>
              {contractSpecificRolesToHuman(role as InstitutionVaultRoleType)}
            </TableCellText>
          ),
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
                onClick={() => onRevokeContractSpecificRole({ address, role })}
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
