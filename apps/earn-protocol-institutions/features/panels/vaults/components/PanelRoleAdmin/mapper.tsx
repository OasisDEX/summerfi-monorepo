import { Button, Icon, TableCellNodes, TableCellText } from '@summerfi/app-earn-ui'

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
}

export const roleAdminMapper = ({
  roles,
  transactionQueue,
  onRevokeContractSpecificRole,
  chainId,
}: RoleAdminMapperParams) => {
  return roles.map(({ address, role }) => {
    const revokeId = getRevokeContractRoleTransactionId({ address, role, chainId })
    const idDisabled = transactionQueue.some((tx) => tx.id === revokeId)

    return {
      content: {
        role: (
          <TableCellText>
            {contractSpecificRolesToHuman(role as InstitutionVaultRoleType)}
          </TableCellText>
        ),
        address: <TableCellNodes className={styles.tableCellAddress}>{address}</TableCellNodes>,
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
                className={styles.onEdit}
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
