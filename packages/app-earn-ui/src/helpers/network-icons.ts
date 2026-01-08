import { type IconNamesList, SupportedNetworkIds, SupportedSDKNetworks } from '@summerfi/app-types'

export const networkNameIconNameMap: Partial<{ [key in SupportedSDKNetworks]: IconNamesList }> = {
  [SupportedSDKNetworks.ArbitrumOne]: 'earn_network_arbitrum',
  [SupportedSDKNetworks.Base]: 'earn_network_base',
  [SupportedSDKNetworks.Mainnet]: 'earn_network_ethereum',
  [SupportedSDKNetworks.SonicMainnet]: 'earn_network_sonic',
  [SupportedSDKNetworks.Hyperliquid]: 'earn_network_hyperliquid',
}

export const networkIdIconNameMap: Partial<{ [key in SupportedNetworkIds]: IconNamesList }> = {
  [SupportedNetworkIds.ArbitrumOne]: 'earn_network_arbitrum',
  [SupportedNetworkIds.Base]: 'earn_network_base',
  [SupportedNetworkIds.Mainnet]: 'earn_network_ethereum',
  [SupportedNetworkIds.SonicMainnet]: 'earn_network_sonic',
  [SupportedNetworkIds.Hyperliquid]: 'earn_network_hyperliquid',
}
