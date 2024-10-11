import { TableCellText, TableRowAccent } from '@summerfi/app-earn-ui'
import { formatDecimalAsPercent } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

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
        currentApy: (
          <TableCellText>{formatDecimalAsPercent(new BigNumber(item.currentApy))}</TableCellText>
        ),
        avgApyPer30d: (
          <TableCellText>{formatDecimalAsPercent(new BigNumber(item.avgApyPer30d))}</TableCellText>
        ),
        avgApyPer1y: (
          <TableCellText>{formatDecimalAsPercent(new BigNumber(item.avgApyPer1y))}</TableCellText>
        ),
        allTimeMedianApy: (
          <TableCellText>
            {formatDecimalAsPercent(new BigNumber(item.allTimeMedianApy))}
          </TableCellText>
        ),
        yieldLowHigh: (
          <TableCellText>
            {formatDecimalAsPercent(new BigNumber(item.yieldLowHigh.low))} /{' '}
            {formatDecimalAsPercent(new BigNumber(item.yieldLowHigh.high))}
          </TableCellText>
        ),
      },
    }
  })
}
