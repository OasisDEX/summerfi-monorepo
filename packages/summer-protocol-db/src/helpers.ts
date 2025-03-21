import { ChainId } from '@summerfi/serverless-shared'

export type DbNetworks = 'arbitrum' | 'optimism' | 'base' | 'mainnet' | 'sonic'

const dbNetworkToChainId: Record<DbNetworks, ChainId> = {
  arbitrum: ChainId.ARBITRUM,
  optimism: ChainId.OPTIMISM,
  base: ChainId.BASE,
  mainnet: ChainId.MAINNET,
  sonic: ChainId.SONIC,
}

export function mapDbNetworkToChainId(network: DbNetworks): ChainId {
  if (!dbNetworkToChainId[network]) {
    throw new Error(`No matching chainId found for network: ${network}`)
  }
  return dbNetworkToChainId[network]
}

export function mapChainIdToDbNetwork(chainId: ChainId): DbNetworks {
  const network = Object.entries(dbNetworkToChainId).find(([_, value]) => {
    return Number(value) === Number(chainId)
  })?.[0]

  if (!network) {
    throw new Error(`No matching database network found for chainId: ${chainId}`)
  }
  return network as DbNetworks
}
