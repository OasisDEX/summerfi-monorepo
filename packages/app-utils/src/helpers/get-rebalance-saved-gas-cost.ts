import {
  type SupportedSDKNetworks,
  type TotalRebalanceItemsPerStrategyId,
} from '@summerfi/app-types'

import { sdkNetworkToHumanNetwork } from './earn-network-tools'

const NETWORK_GAS_SAVINGS: { [key: string]: number } = {
  base: 0.05, // $0.05
  arbitrum: 0.05, // $0.05
  mainnet: 12.0, // $12.00
  sonic: 0.05, // $0.05
  optimism: 0.05, // $0.05
}

type RebalanceCountsType = { total: number } & Partial<{ [key in SupportedSDKNetworks]: number }>

/**
 * Calculates the total gas cost savings from rebalances across all vaults
 * @param totalItemsPerStrategyId - List of vaults with their rebalance counts and network information
 * @returns Total USD value of gas saved across all networks
 */
export const getRebalanceSavedGasCost = (
  totalItemsPerStrategyId: TotalRebalanceItemsPerStrategyId[],
): number => {
  const rebalanceCounts = totalItemsPerStrategyId.reduce<RebalanceCountsType>(
    (acc, vault) => {
      const parts = vault.strategyId.split('-')

      if (parts.length < 2) {
        throw new Error(`Invalid strategyId format: ${vault.strategyId}`)
      }
      const network = parts[1] as SupportedSDKNetworks

      const count = Number(vault.count)

      acc.total += count
      acc[network] = (acc[network] ?? 0) + count

      return acc
    },
    { total: 0 },
  )

  return Object.entries(rebalanceCounts)
    .filter(([key]) => key !== 'total')
    .reduce(
      (acc, [network, count]) =>
        // eslint-disable-next-line no-mixed-operators
        acc +
        // eslint-disable-next-line no-mixed-operators
        count *
          (NETWORK_GAS_SAVINGS[sdkNetworkToHumanNetwork(network as SupportedSDKNetworks)] || 0),
      0,
    )
}
