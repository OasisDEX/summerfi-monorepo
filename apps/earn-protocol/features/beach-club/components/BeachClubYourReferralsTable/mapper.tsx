import { TableCellText } from '@summerfi/app-earn-ui'
import { formatAddress, formatFiatBalance } from '@summerfi/app-utils'

import { type Referrals } from '@/features/beach-club/types'

export const trackReferralsMapper = (rawData: Referrals[]) => {
  return rawData.map((item) => {
    return {
      content: {
        address: <TableCellText>{formatAddress(item.address)}</TableCellText>,
        tvl: <TableCellText>${formatFiatBalance(item.tvl)}</TableCellText>,
        earnedToDate: <TableCellText>${formatFiatBalance(item.earnedToDate)}</TableCellText>,
        forecastAnnualisedEarnings: (
          <TableCellText>${formatFiatBalance(item.forecastAnnualisedEarnings)}</TableCellText>
        ),
      },
    }
  })
}
