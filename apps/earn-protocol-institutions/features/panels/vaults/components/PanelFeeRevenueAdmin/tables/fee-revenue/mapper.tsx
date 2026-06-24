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
            {/* A 0 fee is a known value (0.00%), not missing data — only null/undefined is "n/a". */}
            {item.aumFee != null
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
