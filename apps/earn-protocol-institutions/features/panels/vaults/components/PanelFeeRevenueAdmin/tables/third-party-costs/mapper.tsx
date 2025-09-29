import { Button, Icon, Input, TableCellNodes, TableCellText } from '@summerfi/app-earn-ui'
import { formatAddress, formatDecimalAsPercent } from '@summerfi/app-utils'

import { type InstitutionVaultThirdPartyCost } from '@/types/institution-data'

import styles from '@/features/panels/vaults/components/PanelFeeRevenueAdmin/PanelFeeRevenueAdmin.module.css'

export const thirdPartyCostsMapper = ({
  rawData,
  onEdit,
  onSave,
  onRowEditCancel,
  updatingThirdPartyCostsItem,
  updatingThirdPartyCostsFee,
  updatingThirdPartyCostsAddress,
  onChangeCosts,
  onChangeAddress,
}: {
  rawData: InstitutionVaultThirdPartyCost[]
  onEdit: (item: InstitutionVaultThirdPartyCost) => void
  onSave: (item: InstitutionVaultThirdPartyCost) => void
  onRowEditCancel: () => void
  updatingThirdPartyCostsItem: InstitutionVaultThirdPartyCost | null
  updatingThirdPartyCostsFee: string
  updatingThirdPartyCostsAddress: string
  onChangeCosts: (value: string) => void
  onChangeAddress: (value: string) => void
}) => {
  return rawData.map((cost) => {
    const isUpdating = updatingThirdPartyCostsItem?.type === cost.type

    const resolvedOnClick = () => {
      if (isUpdating) {
        onSave(cost)
      } else {
        onEdit(cost)
      }
    }

    return {
      content: {
        type: <TableCellText>{cost.type}</TableCellText>,
        fee: (
          <TableCellNodes className={isUpdating ? styles.tableCellNodeUpdating : ''}>
            {isUpdating ? (
              <Input
                variant="withBorder"
                wrapperClassName={styles.inputContainer}
                inputWrapperClassName={styles.inputWrapperPercentage}
                value={updatingThirdPartyCostsFee || cost.fee}
                onChange={(e) => onChangeCosts(e.target.value)}
              />
            ) : (
              formatDecimalAsPercent(cost.fee, { precision: 1 })
            )}
          </TableCellNodes>
        ),
        address: (
          <TableCellNodes className={isUpdating ? styles.tableCellNodeUpdating : ''}>
            {isUpdating ? (
              <Input
                variant="withBorder"
                wrapperClassName={styles.inputContainer}
                inputWrapperClassName={styles.inputWrapper}
                value={updatingThirdPartyCostsAddress || cost.address}
                onChange={(e) => onChangeAddress(e.target.value)}
              />
            ) : (
              formatAddress(cost.address, { first: 10, last: 10 })
            )}
          </TableCellNodes>
        ),
        action: (
          <TableCellText
            style={{ marginLeft: isUpdating ? '13px' : '40px', gap: 'var(--spacing-space-small)' }}
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
