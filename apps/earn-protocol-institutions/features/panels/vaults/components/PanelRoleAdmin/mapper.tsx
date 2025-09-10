import { Button, Icon, Input, TableCellNodes, TableCellText } from '@summerfi/app-earn-ui'
import { formatAddress } from '@summerfi/app-utils'
import { type GeneralRoles } from '@summerfi/sdk-client'
import dayjs from 'dayjs'

import { walletRolesToHuman } from '@/helpers/roles-to-human'
import { type InstitutionVaultRole, type InstitutionVaultRoles } from '@/types/institution-data'

import styles from './PanelRoleAdmin.module.css'

export const roleAdminMapper = ({
  roles,
  updatingRole,
  updatingRoleAddress,
  onEdit,
  onSave,
  onChange,
  onRowEditCancel,
}: {
  roles: InstitutionVaultRoles
  updatingRole: InstitutionVaultRole | null
  updatingRoleAddress: string
  onEdit: (item: InstitutionVaultRole) => void
  onSave: (item: InstitutionVaultRole) => void
  onChange: (value: string) => void
  onRowEditCancel: () => void
}) => {
  return Object.entries(roles).map((entry) => {
    const [role, item] = entry

    const isUpdating = updatingRole?.role === role

    const resolvedOnClick = () => {
      const resolvedItem = {
        address: item.address,
        lastUpdated: item.lastUpdated,
        role: role as GeneralRoles,
      }

      if (isUpdating) {
        onSave(resolvedItem)
      } else {
        onEdit(resolvedItem)
      }
    }

    return {
      content: {
        role: <TableCellText>{walletRolesToHuman(role as GeneralRoles)}</TableCellText>,
        address: (
          <TableCellNodes className={isUpdating ? styles.tableCellNodeUpdating : ''}>
            {isUpdating ? (
              <Input
                variant="withBorder"
                wrapperClassName={styles.inputContainer}
                inputWrapperClassName={styles.inputWrapper}
                value={updatingRoleAddress || item.address}
                onChange={(e) => onChange(e.target.value)}
              />
            ) : (
              formatAddress(item.address, { first: 10, last: 10 })
            )}
          </TableCellNodes>
        ),
        'last-updated': (
          <TableCellText>{dayjs(item.lastUpdated).format('MMMM D, YYYY')}</TableCellText>
        ),
        action: (
          <TableCellText
            style={{ marginLeft: isUpdating ? '8px' : '40px', gap: 'var(--spacing-space-small)' }}
          >
            {isUpdating && (
              <Button
                variant="unstyled"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                onClick={onRowEditCancel}
              >
                <Icon iconName="trash" size={20} className={styles.onEdit} />
              </Button>
            )}
            <Button
              variant="unstyled"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              onClick={resolvedOnClick}
            >
              <Icon
                iconName={isUpdating ? 'checkmark' : 'edit'}
                size={16}
                className={styles.onEdit}
              />
            </Button>
          </TableCellText>
        ),
      },
    }
  })
}
