import { customAAKitHyperliquidConfig, customAAKitSonicConfig } from '@summerfi/app-earn-ui'
import { SupportedNetworkIds } from '@summerfi/app-types'
import { createPublicClient, http, type PublicClient } from 'viem'
import { arbitrum, base, mainnet } from 'viem/chains'

import { SDKChainIdToRpcGatewayMap } from '@/constants/networks-list'

/**
 * Public client instances for interacting with different networks
 */
export const arbitrumPublicClient = createPublicClient({
  chain: arbitrum,
  transport: http(SDKChainIdToRpcGatewayMap[SupportedNetworkIds.ArbitrumOne]),
})

export const basePublicClient = createPublicClient({
  chain: base,
  transport: http(SDKChainIdToRpcGatewayMap[SupportedNetworkIds.Base]),
}) as PublicClient // ?? not sure whats up with base typings

export const sonicPublicClient = createPublicClient({
  chain: customAAKitSonicConfig,
  transport: http(SDKChainIdToRpcGatewayMap[SupportedNetworkIds.SonicMainnet]),
})

export const mainnetPublicClient = createPublicClient({
  chain: mainnet,
  transport: http(SDKChainIdToRpcGatewayMap[SupportedNetworkIds.Mainnet]),
})

export const hyperliquidPublicClient = createPublicClient({
  chain: customAAKitHyperliquidConfig,
  transport: http(SDKChainIdToRpcGatewayMap[SupportedNetworkIds.Hyperliquid]),
}) as PublicClient // ?? not sure whats up with hyperliquid typings

export const publicClientMap: {
  [key in SupportedNetworkIds]: PublicClient
} = {
  [SupportedNetworkIds.ArbitrumOne]: arbitrumPublicClient,
  [SupportedNetworkIds.Base]: basePublicClient,
  [SupportedNetworkIds.Mainnet]: mainnetPublicClient,
  [SupportedNetworkIds.SonicMainnet]: sonicPublicClient,
  [SupportedNetworkIds.Hyperliquid]: hyperliquidPublicClient,
}
