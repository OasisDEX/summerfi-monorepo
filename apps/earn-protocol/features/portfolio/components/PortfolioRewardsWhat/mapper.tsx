import { Icon, TableCellText } from '@summerfi/app-earn-ui'
import { formatCryptoBalance } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import { type PortfolioRewardsRawData } from '@/app/server-handlers/portfolio/portfolio-rewards-handler'

export const portfolioRewardsMapper = (rawData: PortfolioRewardsRawData[]) => {
  return rawData.map((item) => {
    return {
      content: {
        position: (
          <TableCellText>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-8)' }}>
              <Icon tokenName={item.symbol} variant="m" />
              {item.symbol} Position
            </div>
          </TableCellText>
        ),
        sumrEarned: (
          <TableCellText>{formatCryptoBalance(new BigNumber(item.sumrEarned))} SUMR</TableCellText>
        ),
        sumrPerDay: (
          <TableCellText>{formatCryptoBalance(new BigNumber(item.sumrPerDay))} SUMR</TableCellText>
        ),
      },
    }
  })
}
