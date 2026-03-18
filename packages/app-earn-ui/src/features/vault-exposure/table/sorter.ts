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
 * Compares two arks with active items first, then inactive
 * Active items (depositCap > 0) are prioritized, both groups sorted by value
 */
const compareWithActiveFirst = (
  a: ExtendedArk,
  b: ExtendedArk,
  getValue: (ark: ExtendedArk) => number | string,
  direction: SortDirection,
): number => {
  const aIsActive = a.depositCap > 0n
  const bIsActive = b.depositCap > 0n

  // If active status differs, active items come first
  if (aIsActive !== bIsActive) {
    return aIsActive ? -1 : 1
  }

  // If both have same active status, compare by value with direction
  return simpleSort({
    a: getValue(a),
    b: getValue(b),
    direction,
  })
}

/**
 * Sorts vault arks based on the specified column and direction
 * Active items (depositCap > 0) are placed at the top, then inactive items
 * Both groups are sorted by their respective values and sort direction
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
        compareWithActiveFirst(a, b, (ark) => Number(ark.inputTokenBalance), sortConfig.direction),
      )
    case 'liveApy':
      return extendedArks.sort((a, b) =>
        compareWithActiveFirst(a, b, (ark) => ark.apy.toNumber(), sortConfig.direction),
      )
    case 'avgApy30d':
      return extendedArks.sort((a, b) =>
        compareWithActiveFirst(a, b, (ark) => ark.avgApy30d.toNumber(), sortConfig.direction),
      )
    case 'avgApy1y':
      return extendedArks.sort((a, b) =>
        compareWithActiveFirst(a, b, (ark) => ark.avgApy1y.toNumber(), sortConfig.direction),
      )
    case 'yearlyLow':
      return extendedArks.sort((a, b) =>
        compareWithActiveFirst(
          a,
          b,
          (ark) => ark.yearlyYieldRange.low.toNumber(),
          sortConfig.direction,
        ),
      )
    case 'yearlyHigh':
      return extendedArks.sort((a, b) =>
        compareWithActiveFirst(
          a,
          b,
          (ark) => ark.yearlyYieldRange.high.toNumber(),
          sortConfig.direction,
        ),
      )
    case 'liquidity':
      return extendedArks.sort((a, b) =>
        compareWithActiveFirst(a, b, (ark) => Number(ark.inputTokenBalance), sortConfig.direction),
      )
    case 'allocationCap':
      return extendedArks.sort((a, b) =>
        compareWithActiveFirst(
          a,
          b,
          (ark) => new BigNumber(ark.capRatio).toString(),
          sortConfig.direction,
        ),
      )
    default:
      return extendedArks.sort((a, b) =>
        compareWithActiveFirst(a, b, (ark) => Number(ark.inputTokenBalance), SortDirection.DESC),
      )
  }
}
