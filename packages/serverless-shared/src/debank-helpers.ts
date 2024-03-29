import { NetworkNames } from './domain-types'

export const DEBANK_SUPPORTED_CHAIN_IDS = ['eth', 'op', 'arb', 'base']
export const DEBANK_SUPPORTED_PROTOCOL_IDS = [
  'aave2',
  'aave3',
  'arb_aave3',
  'op_aave3',
  'base_aave3',
  'ajna',
  'makerdao',
  'spark',
  'morphoblue',
]
export const DEBANK_SUPPORTED_PROXY_IDS = ['summer', 'makerdao']

export enum DebankNetworkNames {
  ethereumMainnet = 'eth',
  arbitrumMainnet = 'arb',
  polygonMainnet = 'matic',
  optimismMainnet = 'op',
  baseMainnet = 'base',
}

export const DebankNetworkNameToOurs = {
  [DebankNetworkNames.ethereumMainnet]: NetworkNames.ethereumMainnet,
  [DebankNetworkNames.arbitrumMainnet]: NetworkNames.arbitrumMainnet,
  [DebankNetworkNames.polygonMainnet]: NetworkNames.polygonMainnet,
  [DebankNetworkNames.optimismMainnet]: NetworkNames.optimismMainnet,
  [DebankNetworkNames.baseMainnet]: NetworkNames.baseMainnet,
}
