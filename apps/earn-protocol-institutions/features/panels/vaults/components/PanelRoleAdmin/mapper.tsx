import { Button, Icon, TableCellText } from '@summerfi/app-earn-ui'
import { formatAddress } from '@summerfi/app-utils'
import dayjs from 'dayjs'

import { rolesToHuman } from '@/helpers/roles-to-human'

import { type RoleAdmin } from './types'

import styles from './PanelRoleAdmin.module.css'

export const roleAdminMapper = ({
  rawData,
  onEdit,
}: {
  rawData: RoleAdmin[]
  onEdit: (item: RoleAdmin) => void
}) => {
  return rawData.map((item) => {
    return {
      content: {
        role: <TableCellText>{rolesToHuman(item.role)}</TableCellText>,
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
              onClick={() => onEdit(item)}
            >
              <Icon iconName="edit" size={16} className={styles.onEdit} />
            </Button>
          </TableCellText>
        ),
      },
    }
  })
}
