import { TableCellNodes, TableCellText } from '@summerfi/app-earn-ui'
import { formatWithSeparators } from '@summerfi/app-utils'

import { type VaultRiskParameters } from './types'

export const vaultRiskParametersMapper = ({ rawData }: { rawData: VaultRiskParameters[] }) => {
  return rawData.map((item) => {
    return {
      content: {
        parameter: <TableCellText>{item.parameter}</TableCellText>,
        value: (
          <TableCellNodes>
            {formatWithSeparators(item.value)}
            {item.token ? ` ${item.token}` : ''}
          </TableCellNodes>
        ),
        action: <TableCellNodes>{item.action}</TableCellNodes>,
      },
    }
  })
}
