import { TableCellText } from '@summerfi/app-earn-ui'
import { formatAddress, formatWithSeparators } from '@summerfi/app-utils'

import { type VaultClientAdminUser } from '@/features/panels/vaults/components/PanelClientAdmin/types'

export const revokedUsersTableMapper = (users: VaultClientAdminUser[]) => {
  return users.map((user) => {
    return {
      content: {
        name: <TableCellText>{user.name}</TableCellText>,
        address: <TableCellText>{formatAddress(user.address)}</TableCellText>,
        'date-revoked': <TableCellText>{user.dateAddedOrRevoked}</TableCellText>,
        'total-balance': (
          <TableCellText>{formatWithSeparators(user.totalBalance, { precision: 2 })}</TableCellText>
        ),
      },
    }
  })
}
