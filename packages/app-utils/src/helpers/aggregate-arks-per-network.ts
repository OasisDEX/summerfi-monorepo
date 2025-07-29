import { type SDKVaultishType, type SupportedSDKNetworks } from '@summerfi/app-types'

import { supportedSDKNetwork } from '@/helpers/earn-network-tools'

type ArksAggregatedByNetwork = { [key in SupportedSDKNetworks]: { arks: SDKVaultishType['arks'] } }

/**
 * Aggregates arks from multiple vaults by their network, ensuring uniqueness of arks within each network
 * @param vaults - Array of vault objects containing protocol and arks information
 * @returns Object with networks as keys and their unique arks as values
 */
export const aggregateArksPerNetwork = (vaults: SDKVaultishType[]): ArksAggregatedByNetwork => {
  return vaults.reduce<ArksAggregatedByNetwork>((acc, vault) => {
    const { network } = vault.protocol
    const castedNetwork = supportedSDKNetwork(network)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!acc[castedNetwork]) {
      acc[castedNetwork] = { arks: [] }
    }
    // Use Set to ensure uniqueness when adding new arks
    acc[castedNetwork].arks = [...new Set([...acc[castedNetwork].arks, ...vault.arks])]

    return acc
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
  }, {} as ArksAggregatedByNetwork)
}
