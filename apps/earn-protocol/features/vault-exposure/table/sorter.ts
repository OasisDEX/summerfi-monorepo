import { type TableSortedColumn } from '@summerfi/app-earn-ui'
import { type SDKVaultType } from '@summerfi/app-types'
import { simpleSort, SortDirection } from '@summerfi/app-utils'

export const rebalanceActivitySorter = ({
  vault,
  sortConfig,
}: {
  vault: SDKVaultType
  sortConfig?: TableSortedColumn<string>
}) => {
  switch (sortConfig?.key) {
    case 'allocation':
      return vault.arks.sort((a, b) =>
        simpleSort({
          a: a.inputTokenBalance,
          b: b.inputTokenBalance,
          direction: sortConfig.direction,
        }),
      )
    case 'currentApy':
      return vault.arks.sort((a, b) =>
        simpleSort({
          a: a.calculatedApr,
          b: b.calculatedApr,
          direction: sortConfig.direction,
        }),
      )
    case 'liquidity':
      return vault.arks.sort((a, b) =>
        simpleSort({
          a: a.inputTokenBalance,
          b: b.inputTokenBalance,
          direction: sortConfig.direction,
        }),
      )
    default:
      return vault.arks.sort((a, b) =>
        simpleSort({
          a: a.inputTokenBalance,
          b: b.inputTokenBalance,
          direction: SortDirection.DESC,
        }),
      )
  }
}
