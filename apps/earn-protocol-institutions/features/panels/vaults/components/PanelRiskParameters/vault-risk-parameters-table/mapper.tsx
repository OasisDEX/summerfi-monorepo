import { Button, Icon, TableCellText } from '@summerfi/app-earn-ui'
import { formatWithSeparators } from '@summerfi/app-utils'

import { type VaultRiskParameters } from './types'

import styles from './../PanelRiskParameters.module.css'

export const vaultRiskParametersMapper = ({
  rawData,
  onEdit,
}: {
  rawData: VaultRiskParameters[]
  onEdit: (item: VaultRiskParameters) => void
}) => {
  return rawData.map((item) => {
    return {
      content: {
        parameter: <TableCellText>{item.parameter}</TableCellText>,
        value: <TableCellText>{formatWithSeparators(item.value)}</TableCellText>,
        action: (
          <TableCellText style={{ marginLeft: '40px' }}>
            <Button
              variant="unstyled"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              onClick={() => onEdit(item)}
            >
              <Icon iconName="edit" size={16} className={styles.onEdit} />
            </Button>
          </TableCellText>
        ),
      },
    }
  })
}
