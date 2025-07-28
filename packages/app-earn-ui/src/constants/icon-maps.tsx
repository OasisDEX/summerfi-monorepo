import {
  type IconNamesList,
  NetworkIds,
  type SupportedNetworkIds,
  SupportedSDKNetworks,
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
  [SupportedSDKNetworks.Mainnet]: 'earn_network_ethereum',
  [SupportedSDKNetworks.Base]: 'earn_network_base',
  [SupportedSDKNetworks.ArbitrumOne]: 'earn_network_arbitrum',
  [SupportedSDKNetworks.Optimism]: 'earn_network_optimism',
  [SupportedSDKNetworks.SonicMainnet]: 'earn_network_sonic',
}
