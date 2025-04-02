import { arbitrum, base, mainnet } from '@account-kit/infra'
import { SDKNetwork, type SDKSupportedNetwork, sdkSupportedNetworks } from '@summerfi/app-types'
import { type Chain } from 'viem'
import { sonic } from 'viem/chains'

/**
 * Converts a SDKNetwork to an AccountKit Chain
 * IMPORTANT: SONIC is currently not reexported from @account-kit/infra, so we need to import it from viem
 * ALSO AccountKit usually uses different viem version internally, so we use chains directly from viem to
 * perform some AA logic (i.e. setChain) it may not work as expected
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
