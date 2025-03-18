import { SDKNetwork, type SDKSupportedNetwork } from '@summerfi/app-types'
import { type Network } from '@summerfi/summer-protocol-db'

export const sdkNetworkToDbNetworkMap: { [key in SDKSupportedNetwork]: Network } = {
  [SDKNetwork.Mainnet]: 'mainnet',
  [SDKNetwork.Base]: 'base',
  [SDKNetwork.ArbitrumOne]: 'arbitrum',
}

// it's somewhere available as method
export const dbNetworkToSdkNetworkMap: { [key in Network]: SDKSupportedNetwork } = {
  mainnet: SDKNetwork.Mainnet,
  base: SDKNetwork.Base,
  arbitrum: SDKNetwork.ArbitrumOne,
}

// Smaller batch size for database inserts
export const DB_BATCH_SIZE = 500

// Larger batch size for subgraph queries
export const SUBGRAPH_BATCH_SIZE = 1000
