import { TableCellText } from '@summerfi/app-earn-ui'
import { formatFiatBalance } from '@summerfi/app-utils'

import { type InstitutionVaultFeeRevenueHistoryItem } from '@/types/institution-data'

export const feeRevenueHistoryMapper = ({
  feeRevenueHistory,
}: {
  feeRevenueHistory: InstitutionVaultFeeRevenueHistoryItem[]
}) => {
  return feeRevenueHistory.map((item) => {
    return {
      content: {
        monthYear: <TableCellText>{item.monthYear}</TableCellText>,
        income: <TableCellText>${formatFiatBalance(item.income)}</TableCellText>,
        expense: <TableCellText>${formatFiatBalance(item.expense)}</TableCellText>,
        revenue: <TableCellText>${formatFiatBalance(item.revenue)}</TableCellText>,
      },
    }
  })
}
