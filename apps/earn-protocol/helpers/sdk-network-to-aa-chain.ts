import { arbitrum, base, mainnet, sonic } from '@account-kit/infra'
import { SDKNetwork, type SDKSupportedNetwork, sdkSupportedNetworks } from '@summerfi/app-types'
import { type Chain } from 'viem'

/**
 * Converts a SDKNetwork to an AccountKit Chain
 * @param network - The SDKNetwork to convert
 * @returns The AccountKit Chain
 */
export const sdkNetworkToAAChain = (network: SDKNetwork): Chain => {
  if (!sdkSupportedNetworks.includes(network as SDKSupportedNetwork)) {
    throw new Error(`Unsupported network: ${network}`)
  }

  const chainMap: { [K in SDKSupportedNetwork]: Chain } = {
    [SDKNetwork.ArbitrumOne]: arbitrum,
    [SDKNetwork.Base]: base,
    [SDKNetwork.Mainnet]: mainnet,
    [SDKNetwork.SonicMainnet]: sonic,
  }

  return chainMap[network as SDKSupportedNetwork]
}
