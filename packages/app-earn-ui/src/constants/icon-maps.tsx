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
  [NetworkIds.SONICMAINNET]: 'earn_network_sonic',
  [NetworkIds.HYPERLIQUID]: 'earn_network_hyperliquid',
}

export const networkNameIconNameMap: {
  [key in SupportedSDKNetworks]: IconNamesList
} = {
  [SupportedSDKNetworks.Mainnet]: 'earn_network_ethereum',
  [SupportedSDKNetworks.Base]: 'earn_network_base',
  [SupportedSDKNetworks.ArbitrumOne]: 'earn_network_arbitrum',
  [SupportedSDKNetworks.SonicMainnet]: 'earn_network_sonic',
  [SupportedSDKNetworks.Hyperliquid]: 'earn_network_hyperliquid',
}
