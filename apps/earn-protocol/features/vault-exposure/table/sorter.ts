import { type TableSortedColumn } from '@summerfi/app-earn-ui'
import { type SDKVaultType } from '@summerfi/app-types'
import { simpleSort, SortDirection } from '@summerfi/app-utils'
import type BigNumber from 'bignumber.js'

type YieldRange = {
  low: BigNumber
  high: BigNumber
}

type ExtendedArk = SDKVaultType['arks'][number] & {
  apy: BigNumber
  avgApy30d: BigNumber
  avgApy1y: BigNumber
  yearlyYieldRange: YieldRange
}

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
    case 'avgApy30d':
      return extendedArks.sort((a, b) =>
        simpleSort({
          a: a.avgApy30d.toNumber(),
          b: b.avgApy30d.toNumber(),
          direction: sortConfig.direction,
        }),
      )
    case 'avgApy1y':
      return extendedArks.sort((a, b) =>
        simpleSort({
          a: a.avgApy1y.toNumber(),
          b: b.avgApy1y.toNumber(),
          direction: sortConfig.direction,
        }),
      )
    case 'yearlyLow':
      return extendedArks.sort((a, b) =>
        simpleSort({
          a: a.yearlyYieldRange.low.toNumber(),
          b: b.yearlyYieldRange.low.toNumber(),
          direction: sortConfig.direction,
        }),
      )
    case 'yearlyHigh':
      return extendedArks.sort((a, b) =>
        simpleSort({
          a: a.yearlyYieldRange.high.toNumber(),
          b: b.yearlyYieldRange.high.toNumber(),
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
