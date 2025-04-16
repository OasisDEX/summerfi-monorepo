import { arbitrum, base, mainnet } from '@account-kit/infra'
import { SDKChainId } from '@summerfi/app-types'
import { createPublicClient, http } from 'viem'

import { customAAKitSonicConfig as sonic } from '@/account-kit/config'
import { SDKChainIdToRpcGatewayMap } from '@/constants/networks-list'

/**
 * Public client instances for interacting with different networks
 */
export const arbitrumPublicClient = createPublicClient({
  chain: arbitrum,
  transport: http(SDKChainIdToRpcGatewayMap[SDKChainId.ARBITRUM]),
})

export const basePublicClient = createPublicClient({
  chain: base,
  transport: http(SDKChainIdToRpcGatewayMap[SDKChainId.BASE]),
})

export const sonicPublicClient = createPublicClient({
  chain: sonic,
  transport: http(SDKChainIdToRpcGatewayMap[SDKChainId.SONIC]),
})

export const mainnetPublicClient = createPublicClient({
  chain: mainnet,
  transport: http(SDKChainIdToRpcGatewayMap[SDKChainId.MAINNET]),
})

export const publicClientMap: {
  [key in
    | SDKChainId.ARBITRUM
    | SDKChainId.BASE
    | SDKChainId.MAINNET
    | SDKChainId.SONIC]: ReturnType<typeof createPublicClient>
} = {
  [SDKChainId.ARBITRUM]: arbitrumPublicClient,
  [SDKChainId.BASE]: basePublicClient,
  [SDKChainId.MAINNET]: mainnetPublicClient,
  [SDKChainId.SONIC]: sonicPublicClient,
}
