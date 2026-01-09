import { SupportedSDKNetworks } from '@summerfi/app-types'

/**
 * Checks if the provided network is supported.
 *
 * @param {SupportedSDKNetworks} network - The network to check.
 * @returns {boolean} - Returns true if the network is ArbitrumOne or Base, otherwise false.
 */
export const supportedNetworkGuard = (
  network: SupportedSDKNetworks,
): network is
  | SupportedSDKNetworks.ArbitrumOne
  | SupportedSDKNetworks.Base
  | SupportedSDKNetworks.Mainnet
  | SupportedSDKNetworks.SonicMainnet
  | SupportedSDKNetworks.Hyperliquid => {
  return [
    SupportedSDKNetworks.ArbitrumOne,
    SupportedSDKNetworks.Base,
    SupportedSDKNetworks.Mainnet,
    SupportedSDKNetworks.SonicMainnet,
    SupportedSDKNetworks.Hyperliquid,
  ].includes(network)
}
