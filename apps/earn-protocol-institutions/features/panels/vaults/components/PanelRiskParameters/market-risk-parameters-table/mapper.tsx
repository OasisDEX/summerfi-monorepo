import { Button, Icon, Input, TableCellNodes, TableCellText } from '@summerfi/app-earn-ui'
import { formatDecimalAsPercent, formatWithSeparators } from '@summerfi/app-utils'

import { type MarketRiskParameters } from './types'

import styles from './../PanelRiskParameters.module.css'

export const marketRiskParametersMapper = ({
  rawData,
  onEdit,
  onSave,
  onRowEditCancel,
  updatingMarketRiskItem,
  updatingMarketRiskMarketCap,
  updatingMarketRiskMaxPercentage,
  updatingMarketRiskImpliedCap,
  onChangeMaxPercentage,
  onChangeMarketCap,
  onChangeImpliedCap,
}: {
  rawData: MarketRiskParameters[]
  onEdit: (item: MarketRiskParameters) => void
  onSave: (item: MarketRiskParameters) => void
  onRowEditCancel: () => void
  updatingMarketRiskItem: MarketRiskParameters | null
  updatingMarketRiskMarketCap: string
  updatingMarketRiskMaxPercentage: string
  updatingMarketRiskImpliedCap: string
  onChangeMaxPercentage: (value: string) => void
  onChangeMarketCap: (value: string) => void
  onChangeImpliedCap: (value: string) => void
}) => {
  return rawData.map((item) => {
    const isUpdating = updatingMarketRiskItem?.id === item.id

    const resolvedOnClick = () => {
      if (isUpdating) {
        onSave(item)
      } else {
        onEdit(item)
      }
    }

    return {
      content: {
        market: <TableCellText>{item.market}</TableCellText>,
        'market-cap': (
          <TableCellNodes className={isUpdating ? styles.tableCellNodeUpdating : ''}>
            {isUpdating ? (
              <Input
                variant="withBorder"
                wrapperClassName={styles.inputContainer}
                inputWrapperClassName={styles.inputWrapper}
                value={updatingMarketRiskMarketCap || item.marketCap}
                onChange={(e) => onChangeMarketCap(e.target.value)}
              />
            ) : (
              formatWithSeparators(item.marketCap)
            )}
          </TableCellNodes>
        ),
        'max-percentage': (
          <TableCellNodes className={isUpdating ? styles.tableCellNodeUpdating : ''}>
            {isUpdating ? (
              <Input
                variant="withBorder"
                wrapperClassName={styles.inputContainer}
                inputWrapperClassName={styles.inputWrapper}
                value={updatingMarketRiskMaxPercentage || item.maxPercentage}
                onChange={(e) => onChangeMaxPercentage(e.target.value)}
              />
            ) : (
              formatDecimalAsPercent(item.maxPercentage, { precision: 1 })
            )}
          </TableCellNodes>
        ),
        'implied-cap': (
          <TableCellNodes className={isUpdating ? styles.tableCellNodeUpdating : ''}>
            {isUpdating ? (
              <Input
                variant="withBorder"
                wrapperClassName={styles.inputContainer}
                inputWrapperClassName={styles.inputWrapper}
                value={updatingMarketRiskImpliedCap || item.impliedCap}
                onChange={(e) => onChangeImpliedCap(e.target.value)}
              />
            ) : (
              formatWithSeparators(item.impliedCap)
            )}
          </TableCellNodes>
        ),
        action: (
          <TableCellText
            style={{ marginLeft: isUpdating ? '8px' : '40px', gap: 'var(--spacing-space-small)' }}
          >
            {isUpdating && (
              <Button
                variant="unstyled"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                onClick={onRowEditCancel}
              >
                <Icon iconName="trash" size={20} className={styles.onEdit} />
              </Button>
            )}
            <Button
              variant="unstyled"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              onClick={resolvedOnClick}
            >
              <Icon
                iconName={isUpdating ? 'checkmark' : 'edit'}
                size={16}
                className={styles.onEdit}
              />
            </Button>
          </TableCellText>
        ),
      },
    }
  })
}
