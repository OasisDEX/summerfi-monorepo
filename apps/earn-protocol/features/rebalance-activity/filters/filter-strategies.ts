import { type SDKRebalancesType } from '@summerfi/app-types'

export const rebalanceFilterStrategies = ({
  strategyFilter,
  rebalance,
}: {
  strategyFilter: string[]
  rebalance: SDKRebalancesType[0]
}) => !strategyFilter.length || strategyFilter.includes(rebalance.vault.id)
