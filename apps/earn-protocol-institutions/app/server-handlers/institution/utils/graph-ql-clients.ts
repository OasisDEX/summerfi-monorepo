import { SupportedSDKNetworks } from '@summerfi/app-types'
import { GraphQLClient } from 'graphql-request'

export const graphqlVaultHistoryClients: { [key in SupportedSDKNetworks]: GraphQLClient } = {
  [SupportedSDKNetworks.Base]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-institutions-base`,
    {
      next: {
        revalidate: 0,
      },
    },
  ),
  [SupportedSDKNetworks.ArbitrumOne]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-institutions-arbitrum`,
    {
      next: {
        revalidate: 0,
      },
    },
  ),
  // these will NOT work
  [SupportedSDKNetworks.SonicMainnet]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-institutions-sonic`,
    {
      next: {
        revalidate: 0,
      },
    },
  ),
  [SupportedSDKNetworks.Mainnet]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-institutions`,
    {
      next: {
        revalidate: 0,
      },
    },
  ),
  [SupportedSDKNetworks.Hyperliquid]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-institutions-hyperliquid`,
    {
      next: {
        revalidate: 0,
      },
    },
  ),
}

// RWA (institutions-v2) subgraphs — deployed on Mainnet + Base only. Mirrors the earn-protocol
// `rwaSubgraphsMap`. Used to read RWA vault NAV / TVL history, which the v1 institutions subgraph
// (above) doesn't index.
export const graphqlRwaVaultHistoryClients: {
  [key in SupportedSDKNetworks]?: GraphQLClient
} = {
  [SupportedSDKNetworks.Mainnet]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-institutions-v2-staging`,
    {
      next: {
        revalidate: 0,
      },
    },
  ),
  [SupportedSDKNetworks.Base]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-institutions-v2-base-staging`,
    {
      next: {
        revalidate: 0,
      },
    },
  ),
}
