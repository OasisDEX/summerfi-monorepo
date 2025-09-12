import { Button, Icon, Input, TableCellNodes, TableCellText } from '@summerfi/app-earn-ui'
import { formatWithSeparators } from '@summerfi/app-utils'

import { type VaultRiskParameters } from './types'

import styles from './../PanelRiskParameters.module.css'

export const vaultRiskParametersMapper = ({
  rawData,
  onEdit,
  onSave,
  onRowEditCancel,
  updatingVaultRiskItem,
  updatingVaultRiskItemValue,
  onChange,
}: {
  rawData: VaultRiskParameters[]
  onEdit: (item: VaultRiskParameters) => void
  onSave: (item: VaultRiskParameters) => void
  onRowEditCancel: () => void
  updatingVaultRiskItem: VaultRiskParameters | null
  updatingVaultRiskItemValue: string
  onChange: (value: string) => void
}) => {
  return rawData.map((item) => {
    const isUpdating = updatingVaultRiskItem?.id === item.id

    const resolvedOnClick = () => {
      if (isUpdating) {
        onSave(item)
      } else {
        onEdit(item)
      }
    }

    return {
      content: {
        parameter: <TableCellText>{item.parameter}</TableCellText>,
        value: (
          <TableCellNodes className={isUpdating ? styles.tableCellNodeUpdating : ''}>
            {isUpdating ? (
              <Input
                variant="withBorder"
                wrapperClassName={styles.inputContainer}
                inputWrapperClassName={styles.inputWrapper}
                value={updatingVaultRiskItemValue || item.value}
                onChange={(e) => onChange(e.target.value)}
              />
            ) : (
              formatWithSeparators(item.value)
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
