import { SupportedSDKNetworks } from '@summerfi/app-types'
import { subgraphNetworkToId } from '@summerfi/app-utils'

export const subgraphsMap = {
  [SupportedSDKNetworks.Mainnet]: `${process.env.SUBGRAPH_BASE}/summer-protocol`,
  [SupportedSDKNetworks.Base]: `${process.env.SUBGRAPH_BASE}/summer-protocol-base`,
  [SupportedSDKNetworks.ArbitrumOne]: `${process.env.SUBGRAPH_BASE}/summer-protocol-arbitrum`,
  [SupportedSDKNetworks.SonicMainnet]: `${process.env.SUBGRAPH_BASE}/summer-protocol-sonic`,
  [SupportedSDKNetworks.Hyperliquid]: `${process.env.SUBGRAPH_BASE}/summer-protocol-hyperliquid`,
}

export const rwaSubgraphsMap = {
  [SupportedSDKNetworks.Mainnet]: `${process.env.SUBGRAPH_BASE}/summer-institutions-v2-staging`,
  [SupportedSDKNetworks.Base]: `${process.env.SUBGRAPH_BASE}/summer-institutions-v2-base-staging`,
}

// Single source of truth for "which chains have an RWA (institutions) subgraph deployed". Everything
// RWA — vaults list, info list, user positions, tables-data ingestion — derives its supported
// networks from here, so enabling a new RWA network is a one-line edit to rwaSubgraphsMap above.
export const rwaSupportedSdkNetworks = Object.keys(
  rwaSubgraphsMap,
) as (keyof typeof rwaSubgraphsMap)[]

export const rwaSupportedChainIds = rwaSupportedSdkNetworks.map((network) =>
  subgraphNetworkToId(network),
)

// chainId → RWA subgraph URL, for handlers that only have a numeric chainId on hand.
export const rwaSubgraphUrlByChainId: { [chainId: number]: string } = Object.fromEntries(
  rwaSupportedSdkNetworks.map((network) => [
    subgraphNetworkToId(network),
    rwaSubgraphsMap[network],
  ]),
)
