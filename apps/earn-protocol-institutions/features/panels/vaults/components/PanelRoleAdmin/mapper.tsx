import { Button, Icon, TableCellNodes, TableCellText } from '@summerfi/app-earn-ui'

import { walletRolesToHuman } from '@/helpers/wallet-roles'
import { type InstitutionVaultRole, type InstitutionVaultRoleType } from '@/types/institution-data'

import styles from './PanelRoleAdmin.module.css'

export const roleAdminMapper = ({ roles }: { roles: InstitutionVaultRole[] }) => {
  return roles.map(({ address, role }) => {
    return {
      content: {
        role: <TableCellText>{walletRolesToHuman(role as InstitutionVaultRoleType)}</TableCellText>,
        address: <TableCellNodes className={styles.tableCellAddress}>{address}</TableCellNodes>,
        action: (
          <TableCellText style={{ marginLeft: '40px', gap: 'var(--spacing-space-small)' }}>
            <Button
              variant="unstyled"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <Icon iconName="trash" size={16} className={styles.onEdit} />
            </Button>
          </TableCellText>
        ),
      },
    }
  })
}
