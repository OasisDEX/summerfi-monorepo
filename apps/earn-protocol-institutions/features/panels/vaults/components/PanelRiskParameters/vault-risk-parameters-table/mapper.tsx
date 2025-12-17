import { TableCellNodes, TableCellText } from '@summerfi/app-earn-ui'

import { type VaultRiskParameters } from './types'

export const vaultRiskParametersMapper = ({ rawData }: { rawData: VaultRiskParameters[] }) => {
  return rawData.map((item) => {
    return {
      content: {
        parameter: <TableCellText>{item.parameter}</TableCellText>,
        value: <TableCellNodes>{item.value}</TableCellNodes>,
      },
    }
  })
}
