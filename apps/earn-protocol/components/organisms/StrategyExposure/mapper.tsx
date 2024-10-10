import { TableCellText, TokensGroup } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatDecimalAsPercent } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import { type StrategyExposureRawData } from '@/components/organisms/StrategyExposure/StrategyExposure'

export const strategyExposureMapper = (rawData: StrategyExposureRawData[]) => {
  return rawData.map((item) => {
    return {
      content: {
        strategy: (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-space-x-small)' }}
          >
            <TokensGroup
              tokens={[item.strategy.primaryToken, item.strategy.secondaryToken]}
              variant="s"
            />
            <TableCellText>{item.strategy.label}</TableCellText>
          </div>
        ),
        allocation: (
          <TableCellText>{formatDecimalAsPercent(new BigNumber(item.allocation))}</TableCellText>
        ),
        currentApy: (
          <TableCellText>{formatDecimalAsPercent(new BigNumber(item.currentApy))}</TableCellText>
        ),
        liquidity: (
          <TableCellText>{formatCryptoBalance(new BigNumber(item.liquidity))}</TableCellText>
        ),
        type: <TableCellText>{item.type}</TableCellText>,
      },
    }
  })
}
