import { type IconNamesList, SDKChainId, SDKNetwork } from '@summerfi/app-types'

export const networkIconByNetworkName: Partial<{ [key in SDKNetwork]: IconNamesList }> = {
  [SDKNetwork.ArbitrumOne]: 'earn_network_arbitrum',
  [SDKNetwork.Base]: 'earn_network_base',
  [SDKNetwork.Mainnet]: 'earn_network_ethereum',
  [SDKNetwork.SonicMainnet]: 'earn_network_sonic',
}

export const networkIconByChainId: Partial<{ [key in SDKChainId]: IconNamesList }> = {
  [SDKChainId.ARBITRUM]: 'earn_network_arbitrum',
  [SDKChainId.BASE]: 'earn_network_base',
  [SDKChainId.MAINNET]: 'earn_network_ethereum',
  [SDKChainId.SONIC]: 'earn_network_sonic',
}
