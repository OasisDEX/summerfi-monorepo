import { ChainId } from '@summerfi/serverless-shared'
export type DbNetworks = 'arbitrum' | 'optimism' | 'base' | 'mainnet' | 'sonic' | 'hyperliquid'
export declare function mapDbNetworkToChainId(network: DbNetworks): ChainId
export declare function mapChainIdToDbNetwork(chainId: ChainId): DbNetworks
//# sourceMappingURL=helpers.d.ts.map
