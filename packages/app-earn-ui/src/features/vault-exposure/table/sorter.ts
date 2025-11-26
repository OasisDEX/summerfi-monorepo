import { type SDKVaultType } from '@summerfi/app-types'
import { simpleSort, SortDirection } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import { type TableSortedColumn } from '@/components/organisms/Table/Table'

type YieldRange = {
  low: BigNumber
  high: BigNumber
}

type ExtendedArk = SDKVaultType['arks'][number] & {
  apy: BigNumber
  avgApy30d: BigNumber
  avgApy1y: BigNumber
  yearlyYieldRange: YieldRange
  arkTokenTVL: BigNumber
  allocationRatio: BigNumber | string
  capRatio: BigNumber | string
  vaultTvlAllocationCap: BigNumber
  mainAllocationCap: BigNumber
  absoluteAllocationCap: BigNumber | string
  maxPercentageTVL: BigNumber | string
}

/**
 * Sorts vault arks based on the specified column and direction
 * @param extendedArks - Array of extended ark objects to sort
 * @param sortConfig - Configuration for sorting (column and direction)
 * @returns Sorted array of extended arks
 */
export const vaultExposureSorter = ({
  extendedArks,
  sortConfig,
}: {
  extendedArks: ExtendedArk[]
  sortConfig?: TableSortedColumn<string>
}): ExtendedArk[] => {
  switch (sortConfig?.key) {
    case 'allocated':
      return extendedArks.sort((a, b) =>
        simpleSort({
          a: a.inputTokenBalance + (a.depositCap > 0n ? 1n : 0n),
          b: b.inputTokenBalance,
          direction: sortConfig.direction,
        }),
      )
    case 'liveApy':
      return extendedArks.sort((a, b) =>
        simpleSort({
          a: a.apy.toNumber() + (a.depositCap > 0n ? 1 : 0),
          b: b.apy.toNumber(),
          direction: sortConfig.direction,
        }),
      )
    case 'avgApy30d':
      return extendedArks.sort((a, b) =>
        simpleSort({
          a: a.avgApy30d.toNumber() + (a.depositCap > 0n ? 1 : 0),
          b: b.avgApy30d.toNumber(),
          direction: sortConfig.direction,
        }),
      )
    case 'avgApy1y':
      return extendedArks.sort((a, b) =>
        simpleSort({
          a: a.avgApy1y.toNumber() + (a.depositCap > 0n ? 1 : 0),
          b: b.avgApy1y.toNumber(),
          direction: sortConfig.direction,
        }),
      )
    case 'yearlyLow':
      return extendedArks.sort((a, b) =>
        simpleSort({
          a: a.yearlyYieldRange.low.toNumber() + (a.depositCap > 0n ? 1 : 0),
          b: b.yearlyYieldRange.low.toNumber(),
          direction: sortConfig.direction,
        }),
      )
    case 'yearlyHigh':
      return extendedArks.sort((a, b) =>
        simpleSort({
          a: a.yearlyYieldRange.high.toNumber() + (a.depositCap > 0n ? 1 : 0),
          b: b.yearlyYieldRange.high.toNumber(),
          direction: sortConfig.direction,
        }),
      )
    case 'liquidity':
      return extendedArks.sort((a, b) =>
        simpleSort({
          a: a.inputTokenBalance + (a.depositCap > 0n ? 1n : 0n),
          b: b.inputTokenBalance,
          direction: sortConfig.direction,
        }),
      )
    case 'allocationCap':
      return extendedArks.sort((a, b) => {
        return simpleSort({
          a: new BigNumber(a.capRatio).toString() + (a.depositCap > 0n ? 1 : 0),
          b: new BigNumber(b.capRatio).toString(),
          direction: sortConfig.direction,
        })
      })
    default:
      return extendedArks.sort((a, b) =>
        simpleSort({
          a: a.inputTokenBalance + (a.depositCap > 0n ? 1n : 0n),
          b: b.inputTokenBalance,
          direction: SortDirection.DESC,
        }),
      )
  }
}
