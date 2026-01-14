import { NetworkNames } from './domain-types'

// For each new network, add a new enum value
export const DEBANK_SUPPORTED_CHAIN_IDS = ['eth', 'op', 'arb', 'base', 'matic', 'sonic', 'hyper']
// For each new protocol, add a new enum value as network_protocol
export const DEBANK_SUPPORTED_PROTOCOL_IDS = [
  // Mainnet
  'aave2',
  'aave3',
  'ajna',
  'makerdao',
  'spark',
  'morphoblue',
  // Optimism
  'op_aave3',
  'op_ajna',
  // Arbitrum
  'arb_aave3',
  'arb_ajna',
  // Base
  'base_aave3',
  'base_ajna',
  'base_morphoblue',
]
export const DEBANK_SUPPORTED_PROXY_IDS = ['summer', 'makerdao']

export enum DebankNetworkNames {
  ethereumMainnet = 'eth',
  arbitrumMainnet = 'arb',
  polygonMainnet = 'matic',
  optimismMainnet = 'op',
  baseMainnet = 'base',
  sonicMainnet = 'sonic',
  hyperliquidMainnet = 'hyper',
}

export const DebankNetworkNameToOurs = {
  [DebankNetworkNames.ethereumMainnet]: NetworkNames.ethereumMainnet,
  [DebankNetworkNames.arbitrumMainnet]: NetworkNames.arbitrumMainnet,
  [DebankNetworkNames.polygonMainnet]: NetworkNames.polygonMainnet,
  [DebankNetworkNames.optimismMainnet]: NetworkNames.optimismMainnet,
  [DebankNetworkNames.baseMainnet]: NetworkNames.baseMainnet,
  [DebankNetworkNames.sonicMainnet]: NetworkNames.sonicMainnet,
  [DebankNetworkNames.hyperliquidMainnet]: NetworkNames.hyperliquidMainnet,
}
