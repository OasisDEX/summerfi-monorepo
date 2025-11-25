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
}
