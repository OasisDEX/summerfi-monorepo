import { TableCellNodes, TableCellText } from '@summerfi/app-earn-ui'
import { formatDecimalAsPercent, formatWithSeparators } from '@summerfi/app-utils'

import { type MarketRiskParameters } from './types'

export const marketRiskParametersMapper = ({ rawData }: { rawData: MarketRiskParameters[] }) => {
  return rawData.map((item) => {
    return {
      content: {
        market: <TableCellText>{item.market}</TableCellText>,
        'market-cap': (
          <TableCellNodes>
            {formatWithSeparators(item.marketCap)}
            {item.token ? ` ${item.token}` : ''}
          </TableCellNodes>
        ),
        'max-percentage': (
          <TableCellNodes>
            {formatDecimalAsPercent(item.maxPercentage, { precision: 1 })}
          </TableCellNodes>
        ),
        'implied-cap': (
          <TableCellNodes>
            {formatWithSeparators(item.impliedCap)}
            {item.token ? ` ${item.token}` : ''}
          </TableCellNodes>
        ),
      },
    }
  })
}
