import { Button, Icon, TableCellText } from '@summerfi/app-earn-ui'
import { formatAddress, formatDecimalAsPercent } from '@summerfi/app-utils'

import { type InstitutionVaultThirdPartyCost } from '@/types/institution-data'

import classNames from '@/features/panels/vaults/components/PanelFeeRevenueAdmin/PanelFeeRevenueAdmin.module.css'

export const thirdPartyCostsMapper = ({ costs }: { costs: InstitutionVaultThirdPartyCost[] }) => {
  return costs.map((cost) => {
    return {
      content: {
        type: <TableCellText>{cost.type}</TableCellText>,
        fee: <TableCellText>{formatDecimalAsPercent(cost.fee)}</TableCellText>,
        address: <TableCellText>{formatAddress(cost.address)}</TableCellText>,
        action: (
          <TableCellText style={{ marginLeft: '40px' }}>
            <Button
              variant="unstyled"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <Icon iconName="edit" size={16} className={classNames.onEdit} />
            </Button>
          </TableCellText>
        ),
      },
    }
  })
}
