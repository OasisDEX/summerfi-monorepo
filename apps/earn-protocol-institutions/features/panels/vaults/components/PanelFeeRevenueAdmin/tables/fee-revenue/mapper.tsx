import { TableCellNodes, TableCellText } from '@summerfi/app-earn-ui'
import { formatDecimalAsPercent } from '@summerfi/app-utils'

import { type InstitutionVaultFeeRevenueItem } from '@/types/institution-data'

export const feeRevenueMapper = ({ rawData }: { rawData: InstitutionVaultFeeRevenueItem[] }) => {
  return rawData.map((item) => {
    return {
      content: {
        name: <TableCellText>{item.name}</TableCellText>,
        'aum-fee': (
          <TableCellNodes>
            {item.aumFee
              ? formatDecimalAsPercent(item.aumFee, {
                  precision: 2,
                })
              : 'n/a'}
          </TableCellNodes>
        ),
      },
    }
  })
}
