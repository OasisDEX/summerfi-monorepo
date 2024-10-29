import { type SDKRebalancesType } from '@summerfi/app-types'

export const rebalanceFilterTokens = ({
  tokenFilter,
  rebalance,
}: {
  tokenFilter: string[]
  rebalance: SDKRebalancesType[0]
}) => !tokenFilter.length || tokenFilter.includes(rebalance.vault.inputToken.symbol)
