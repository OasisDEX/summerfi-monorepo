import { type IconNamesList, SDKChainId, SDKNetwork } from '@summerfi/app-types'

export const networkIconByNetworkName: Partial<{ [key in SDKNetwork]: IconNamesList }> = {
  [SDKNetwork.ArbitrumOne]: 'earn_network_arbitrum',
  [SDKNetwork.Base]: 'earn_network_base',
  // [SDKNetwork.Blast]: 'earn_network_blast',
  [SDKNetwork.Mainnet]: 'earn_network_ethereum',
  // [SDKNetwork.Optimism]: 'earn_network_optimism',
}

export const networkIconByChainId: Partial<{ [key in SDKChainId]: IconNamesList }> = {
  [SDKChainId.ARBITRUM]: 'earn_network_arbitrum',
  [SDKChainId.BASE]: 'earn_network_base',
  [SDKChainId.MAINNET]: 'earn_network_ethereum',
  [SDKChainId.OPTIMISM]: 'earn_network_optimism',
  [SDKChainId.SONIC]: 'not_supported_icon',
}
