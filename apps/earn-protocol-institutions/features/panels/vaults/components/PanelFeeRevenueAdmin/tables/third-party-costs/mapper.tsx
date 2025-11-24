import { TableCellNodes, TableCellText } from '@summerfi/app-earn-ui'
import { formatAddress, formatDecimalAsPercent } from '@summerfi/app-utils'

import { type InstitutionVaultThirdPartyCost } from '@/types/institution-data'

export const thirdPartyCostsMapper = ({
  rawData,
}: {
  rawData: InstitutionVaultThirdPartyCost[]
}) => {
  return rawData.map((cost) => {
    return {
      content: {
        type: <TableCellText>{cost.type}</TableCellText>,
        fee: <TableCellNodes>{formatDecimalAsPercent(cost.fee, { precision: 1 })}</TableCellNodes>,
        address: (
          <TableCellNodes>{formatAddress(cost.address, { first: 10, last: 10 })}</TableCellNodes>
        ),
      },
    }
  })
}
