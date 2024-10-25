import { TableCellText, TableRowAccent } from '@summerfi/app-earn-ui'
import { formatDecimalAsPercent } from '@summerfi/app-utils'

export interface IndividualYieldsRawData {
  strategy: string
  currentApy: string
  avgApyPer30d: string
  avgApyPer1y: string
  allTimeMedianApy: string
  yieldLowHigh: {
    low: string
    high: string
  }
}

export const individualYieldsMapper = (rawData: IndividualYieldsRawData[]) => {
  return rawData.map((item) => {
    return {
      content: {
        strategy: (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-space-x-small)' }}
          >
            <TableRowAccent backgroundColor="var(--earn-protocol-accent-1-100)" />
            <TableCellText>{item.strategy}</TableCellText>
          </div>
        ),
        currentApy: <TableCellText>{formatDecimalAsPercent(item.currentApy)}</TableCellText>,
        avgApyPer30d: <TableCellText>{formatDecimalAsPercent(item.avgApyPer30d)}</TableCellText>,
        avgApyPer1y: <TableCellText>{formatDecimalAsPercent(item.avgApyPer1y)}</TableCellText>,
        allTimeMedianApy: (
          <TableCellText>{formatDecimalAsPercent(item.allTimeMedianApy)}</TableCellText>
        ),
        yieldLowHigh: (
          <TableCellText>
            {formatDecimalAsPercent(item.yieldLowHigh.low)} /{' '}
            {formatDecimalAsPercent(item.yieldLowHigh.high)}
          </TableCellText>
        ),
      },
    }
  })
}
