import { type TableSortedColumn } from '@summerfi/app-earn-ui'
import { type SDKVaultType } from '@summerfi/app-types'
import { simpleSort, SortDirection } from '@summerfi/app-utils'
import type BigNumber from 'bignumber.js'

type ExtendedArk = SDKVaultType['arks'][number] & { apy: BigNumber }

export const vaultExposureSorter = ({
  extendedArks,
  sortConfig,
}: {
  extendedArks: ExtendedArk[]
  sortConfig?: TableSortedColumn<string>
}) => {
  switch (sortConfig?.key) {
    case 'allocation':
      return extendedArks.sort((a, b) =>
        simpleSort({
          a: a.inputTokenBalance,
          b: b.inputTokenBalance,
          direction: sortConfig.direction,
        }),
      )
    case 'currentApy':
      return extendedArks.sort((a, b) =>
        simpleSort({
          a: a.apy.toNumber(),
          b: b.apy.toNumber(),
          direction: sortConfig.direction,
        }),
      )
    case 'liquidity':
      return extendedArks.sort((a, b) =>
        simpleSort({
          a: a.inputTokenBalance,
          b: b.inputTokenBalance,
          direction: sortConfig.direction,
        }),
      )
    default:
      return extendedArks.sort((a, b) =>
        simpleSort({
          a: a.inputTokenBalance,
          b: b.inputTokenBalance,
          direction: SortDirection.DESC,
        }),
      )
  }
}
