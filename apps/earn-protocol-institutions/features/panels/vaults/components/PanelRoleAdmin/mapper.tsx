import { Button, Icon, TableCellText } from '@summerfi/app-earn-ui'
import { formatAddress } from '@summerfi/app-utils'
import { type GeneralRoles } from '@summerfi/sdk-client'
import dayjs from 'dayjs'

import { walletRolesToHuman } from '@/helpers/roles-to-human'
import { type InstitutionVaultRole, type InstitutionVaultRoles } from '@/types/institution-data'

import styles from './PanelRoleAdmin.module.css'

export const roleAdminMapper = ({
  roles,
  onEdit,
}: {
  roles: InstitutionVaultRoles
  onEdit: (item: InstitutionVaultRole) => void
}) => {
  return Object.entries(roles).map((entry) => {
    const [role, item] = entry

    return {
      content: {
        role: <TableCellText>{walletRolesToHuman(role as GeneralRoles)}</TableCellText>,
        address: (
          <TableCellText>{formatAddress(item.address, { first: 10, last: 10 })}</TableCellText>
        ),
        'last-updated': (
          <TableCellText>{dayjs(item.lastUpdated).format('MMMM D, YYYY')}</TableCellText>
        ),
        action: (
          <TableCellText style={{ marginLeft: '40px' }}>
            <Button
              variant="unstyled"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              onClick={() => onEdit(entry as InstitutionVaultRole)}
            >
              <Icon iconName="edit" size={16} className={styles.onEdit} />
            </Button>
          </TableCellText>
        ),
      },
    }
  })
}
