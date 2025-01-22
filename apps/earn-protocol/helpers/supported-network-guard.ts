import { SDKNetwork } from '@summerfi/app-types'

/**
 * Checks if the provided network is supported.
 *
 * @param {SDKNetwork} network - The network to check.
 * @returns {boolean} - Returns true if the network is ArbitrumOne or Base, otherwise false.
 */
export const supportedNetworkGuard = (
  network: SDKNetwork,
): network is SDKNetwork.ArbitrumOne | SDKNetwork.Base | SDKNetwork.Mainnet => {
  return [SDKNetwork.ArbitrumOne, SDKNetwork.Base, SDKNetwork.Mainnet].includes(network)
}
