import { Button, Icon, TableCellText } from '@summerfi/app-earn-ui'
import { formatDecimalAsPercent, formatWithSeparators } from '@summerfi/app-utils'

import { type RiskParameters } from './types'

import styles from './PanelRiskParameters.module.css'

export const riskParametersMapper = ({
  rawData,
  onEdit,
}: {
  rawData: RiskParameters[]
  onEdit: (item: RiskParameters) => void
}) => {
  return rawData.map((item) => {
    return {
      content: {
        market: <TableCellText>{item.market}</TableCellText>,
        'market-cap': <TableCellText>{formatWithSeparators(item.marketCap)}</TableCellText>,
        'max-percentage': (
          <TableCellText>
            {formatDecimalAsPercent(item.maxPercentage, { precision: 1 })}
          </TableCellText>
        ),
        'implied-cap': <TableCellText>{formatWithSeparators(item.impliedCap)}</TableCellText>,
        action: (
          <TableCellText>
            <Button
              variant="unstyled"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              onClick={() => onEdit(item)}
            >
              <Icon iconName="edit" size={20} className={styles.onEdit} />
            </Button>
          </TableCellText>
        ),
      },
    }
  })
}
