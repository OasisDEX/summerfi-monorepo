import { type SDKNetwork, type SDKVaultsListType } from '@summerfi/app-types'

import { sdkNetworkToHumanNetwork } from './earn-network-tools'

const NETWORK_GAS_SAVINGS: { [key: string]: number } = {
  base: 0.05, // $0.05
  arbitrum: 0.05, // $0.05
  mainnet: 20.0, // $20.00
}

type RebalanceCountsType = { total: number } & Partial<{ [key in SDKNetwork]: number }>

/**
 * Calculates the total gas cost savings from rebalances across all vaults
 * @param vaultsList - List of vaults with their rebalance counts and network information
 * @returns Total USD value of gas saved across all networks
 */
export const getRebalanceSavedGasCost = (vaultsList: SDKVaultsListType): number => {
  const rebalanceCounts = vaultsList.reduce<RebalanceCountsType>(
    (acc, vault) => {
      const { network } = vault.protocol
      const count = Number(vault.rebalanceCount)

      acc.total += count
      acc[network] = (acc[network] ?? 0) + count

      return acc
    },
    { total: 0 },
  )

  return Object.entries(rebalanceCounts)
    .filter(([key]) => key !== 'total')
    .reduce(
      (total, [network, count]) =>
        // eslint-disable-next-line no-mixed-operators
        total + count * (NETWORK_GAS_SAVINGS[sdkNetworkToHumanNetwork(network as SDKNetwork)] || 0),
      0,
    )
}
