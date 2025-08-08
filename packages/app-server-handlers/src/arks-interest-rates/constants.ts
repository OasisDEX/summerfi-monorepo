import { SupportedSDKNetworks } from '@summerfi/app-types'
import { type GetInterestRatesQuery } from '@summerfi/summer-earn-rates-subgraph'
import { GraphQLClient } from 'graphql-request'

export const graphqlClients: { [key in SupportedSDKNetworks]: GraphQLClient } = {
  [SupportedSDKNetworks.Mainnet]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-earn-protocol-rates`,
  ),
  [SupportedSDKNetworks.Base]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-earn-protocol-rates-base`,
  ),
  [SupportedSDKNetworks.ArbitrumOne]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-earn-protocol-rates-arbitrum`,
  ),
  [SupportedSDKNetworks.SonicMainnet]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-earn-protocol-rates-sonic`,
  ),
}

export const noInterestRates: GetInterestRatesQuery = {
  dailyInterestRates: [{ id: '0', averageRate: 0, date: '0' }],
  hourlyInterestRates: [{ id: '0', averageRate: 0, date: '0' }],
  weeklyInterestRates: [{ id: '0', averageRate: 0, date: '0' }],
  latestInterestRate: [
    {
      rate: [{ id: '0', rate: 0, timestamp: '0' }],
    },
  ],
}
