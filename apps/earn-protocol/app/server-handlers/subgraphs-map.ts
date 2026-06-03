import { SupportedSDKNetworks } from '@summerfi/app-types'

export const subgraphsMap = {
  [SupportedSDKNetworks.Mainnet]: `${process.env.SUBGRAPH_BASE}/summer-protocol`,
  [SupportedSDKNetworks.Base]: `${process.env.SUBGRAPH_BASE}/summer-protocol-base`,
  [SupportedSDKNetworks.ArbitrumOne]: `${process.env.SUBGRAPH_BASE}/summer-protocol-arbitrum`,
  [SupportedSDKNetworks.SonicMainnet]: `${process.env.SUBGRAPH_BASE}/summer-protocol-sonic`,
  [SupportedSDKNetworks.Hyperliquid]: `${process.env.SUBGRAPH_BASE}/summer-protocol-hyperliquid`,
}

export const rwaSubgraphsMap = {
  [SupportedSDKNetworks.Base]: `${process.env.SUBGRAPH_BASE}/summer-institutions-v2-base`,
}
