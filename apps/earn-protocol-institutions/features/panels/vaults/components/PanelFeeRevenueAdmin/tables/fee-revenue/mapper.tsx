import { Button, Icon, Input, TableCellNodes, TableCellText } from '@summerfi/app-earn-ui'
import { formatDecimalAsPercent } from '@summerfi/app-utils'

import { type InstitutionVaultFeeRevenueItem } from '@/types/institution-data'

import styles from '@/features/panels/vaults/components/PanelFeeRevenueAdmin/PanelFeeRevenueAdmin.module.css'

export const feeRevenueMapper = ({
  rawData,
  onEdit,
  onSave,
  onRowEditCancel,
  updatingFeeRevenueItem,
  updatingFeeRevenueItemValue,
  onChange,
}: {
  rawData: InstitutionVaultFeeRevenueItem[]
  onEdit: (item: InstitutionVaultFeeRevenueItem) => void
  onSave: (item: InstitutionVaultFeeRevenueItem) => void
  onRowEditCancel: () => void
  updatingFeeRevenueItem: InstitutionVaultFeeRevenueItem | null
  updatingFeeRevenueItemValue: string
  onChange: (value: string) => void
}) => {
  return rawData.map((item) => {
    const isUpdating = updatingFeeRevenueItem?.name === item.name

    const resolvedOnClick = () => {
      if (isUpdating) {
        onSave(item)
      } else {
        onEdit(item)
      }
    }

    return {
      content: {
        name: <TableCellText>{item.name}</TableCellText>,
        'aum-fee': (
          <TableCellNodes className={isUpdating ? styles.tableCellNodeUpdating : ''}>
            {isUpdating ? (
              <Input
                variant="withBorder"
                wrapperClassName={styles.inputContainer}
                inputWrapperClassName={styles.inputWrapper}
                value={updatingFeeRevenueItemValue || item.aumFee}
                onChange={(e) => onChange(e.target.value)}
              />
            ) : (
              formatDecimalAsPercent(item.aumFee)
            )}
          </TableCellNodes>
        ),
        action: (
          <TableCellText
            style={{
              marginLeft: isUpdating ? '67px' : '40px',
              gap: 'var(--spacing-space-small)',
            }}
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
