import { SupportedSDKNetworks } from '@summerfi/app-types'
import { GraphQLClient } from 'graphql-request'

export const graphqlVaultHistoryClients: { [key in SupportedSDKNetworks]: GraphQLClient } = {
  [SupportedSDKNetworks.Base]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-institutions-base`,
  ),
  [SupportedSDKNetworks.ArbitrumOne]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-institutions-arbitrum`,
  ),
  // these will NOT work
  [SupportedSDKNetworks.SonicMainnet]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-institutions-sonic`,
  ),
  [SupportedSDKNetworks.Mainnet]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-institutions`,
  ),
}
