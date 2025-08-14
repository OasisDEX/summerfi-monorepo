import { Button, Icon, TableCellText } from '@summerfi/app-earn-ui'
import { formatDecimalAsPercent } from '@summerfi/app-utils'

import { type InstitutionVaultFeeRevenueItem } from '@/types/institution-data'

import classNames from '@/features/panels/vaults/components/PanelFeeRevenueAdmin/PanelFeeRevenueAdmin.module.css'

export const feeRevenueMapper = ({
  feeRevenue,
}: {
  feeRevenue: InstitutionVaultFeeRevenueItem[]
}) => {
  return feeRevenue.map((item) => {
    return {
      content: {
        name: <TableCellText>{item.name}</TableCellText>,
        'aum-fee': <TableCellText>{formatDecimalAsPercent(item.aumFee)}</TableCellText>,
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
