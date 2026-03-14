import { customAAKitHyperliquidConfig, customAAKitSonicConfig } from '@summerfi/app-earn-ui'
import { SupportedSDKNetworks } from '@summerfi/app-types'
import { type Chain } from 'viem'
import { arbitrum, base, mainnet } from 'viem/chains'

/**
 * Converts a SupportedSDKNetworks to an AccountKit Chain
 * IMPORTANT: SONIC chain config is imported from viem
 * ALSO AccountKit usually uses different viem version internally, so we use chains directly from viem to
 * perform some AA logic (i.e. setChain) it may not work as expected
 * ADDITIONALY for time being sonic doesn't support smart accounts
 * @param network - The SupportedSDKNetworks to convert
 * @returns The AccountKit Chain
 */
export const sdkNetworkToAAChain = (network: SupportedSDKNetworks): Chain => {
  if (!Object.values(SupportedSDKNetworks).includes(network as SupportedSDKNetworks)) {
    throw new Error(
      `Unsupported network: ${network}, supported networks are: ${Object.values(SupportedSDKNetworks).join(', ')}`,
    )
  }

  const chainMap: { [K in SupportedSDKNetworks]: Chain } = {
    [SupportedSDKNetworks.ArbitrumOne]: arbitrum,
    [SupportedSDKNetworks.Base]: base,
    [SupportedSDKNetworks.Mainnet]: mainnet,
    [SupportedSDKNetworks.SonicMainnet]: customAAKitSonicConfig,
    [SupportedSDKNetworks.Hyperliquid]: customAAKitHyperliquidConfig,
  }

  return chainMap[network as SupportedSDKNetworks]
}
