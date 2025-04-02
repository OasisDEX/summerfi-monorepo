import { type SDKNetwork, type SDKVaultishType } from '@summerfi/app-types'

type ArksAggregatedByNetwork = { [key in SDKNetwork]: { arks: SDKVaultishType['arks'] } }

/**
 * Aggregates arks from multiple vaults by their network, ensuring uniqueness of arks within each network
 * @param vaults - Array of vault objects containing protocol and arks information
 * @returns Object with networks as keys and their unique arks as values
 */
export const aggregateArksPerNetwork = (vaults: SDKVaultishType[]): ArksAggregatedByNetwork => {
  return vaults.reduce<ArksAggregatedByNetwork>((acc, vault) => {
    const { network } = vault.protocol

    if (!acc[network]) {
      acc[network] = { arks: [] }
    }
    // Use Set to ensure uniqueness when adding new arks
    acc[network].arks = [...new Set([...acc[network].arks, ...vault.arks])]

    return acc
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
  }, {} as ArksAggregatedByNetwork)
}
