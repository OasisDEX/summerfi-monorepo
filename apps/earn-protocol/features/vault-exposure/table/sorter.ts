import { type TableSortedColumn } from '@summerfi/app-earn-ui'
import { type SDKVaultType } from '@summerfi/app-types'
import { simpleSort, SortDirection } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

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

export const vaultExposureSorter = ({
  extendedArks,
  sortConfig,
}: {
  extendedArks: ExtendedArk[]
  sortConfig?: TableSortedColumn<string>
}) => {
  switch (sortConfig?.key) {
    case 'allocated':
      return extendedArks.sort((a, b) =>
        simpleSort({
          a: a.inputTokenBalance,
          b: b.inputTokenBalance,
          direction: sortConfig.direction,
        }),
      )
    case 'liveApy':
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
    case 'allocationCap':
      return extendedArks.sort((a, b) => {
        return simpleSort({
          a: new BigNumber(a.capRatio).toString(),
          b: new BigNumber(b.capRatio).toString(),
          direction: sortConfig.direction,
        })
      })
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
