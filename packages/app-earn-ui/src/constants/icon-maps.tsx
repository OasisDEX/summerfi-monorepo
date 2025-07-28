import {
  type IconNamesList,
  NetworkIds,
  SDKNetwork,
  type SupportedNetworkIds,
  type SupportedSDKNetworks,
} from '@summerfi/app-types'

export const networkIdIconNameMap: {
  [key in SupportedNetworkIds]: IconNamesList
} = {
  [NetworkIds.MAINNET]: 'earn_network_ethereum',
  [NetworkIds.BASEMAINNET]: 'earn_network_base',
  [NetworkIds.ARBITRUMMAINNET]: 'earn_network_arbitrum',
  [NetworkIds.OPTIMISMMAINNET]: 'earn_network_optimism',
  [NetworkIds.SONICMAINNET]: 'earn_network_sonic',
}

export const networkNameIconNameMap: {
  [key in SupportedSDKNetworks]: IconNamesList
} = {
  [SDKNetwork.Mainnet]: 'earn_network_ethereum',
  [SDKNetwork.Base]: 'earn_network_base',
  [SDKNetwork.ArbitrumOne]: 'earn_network_arbitrum',
  [SDKNetwork.Optimism]: 'earn_network_optimism',
  [SDKNetwork.SonicMainnet]: 'earn_network_sonic',
}
