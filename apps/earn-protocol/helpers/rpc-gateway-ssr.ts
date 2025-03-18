import { NetworkNames, SDKChainId } from '@summerfi/app-types'

import { getRpcGatewayUrl } from '@/helpers/rpc-gateway'

export const mainnetRpc = getRpcGatewayUrl(NetworkNames.ethereumMainnet)
export const goerliRpc = getRpcGatewayUrl(NetworkNames.ethereumGoerli)
export const arbitrumMainnetRpc = getRpcGatewayUrl(NetworkNames.arbitrumMainnet)
export const arbitrumGoerliRpc = getRpcGatewayUrl(NetworkNames.arbitrumGoerli)
export const polygonMainnetRpc = getRpcGatewayUrl(NetworkNames.polygonMainnet)
export const polygonMumbaiRpc = getRpcGatewayUrl(NetworkNames.polygonMumbai)
export const optimismMainnetRpc = getRpcGatewayUrl(NetworkNames.optimismMainnet)
export const optimismGoerliRpc = getRpcGatewayUrl(NetworkNames.optimismGoerli)
export const baseMainnetRpc = getRpcGatewayUrl(NetworkNames.baseMainnet)
export const baseGoerliRpc = getRpcGatewayUrl(NetworkNames.baseGoerli)
export const sonicMainnetRpc = getRpcGatewayUrl(NetworkNames.sonicMainnet)
// use this ONLY server side so it doesnt leak to the client
export const SDKChainIdToSSRRpcGatewayMap = {
  [SDKChainId.ARBITRUM]: arbitrumMainnetRpc,
  [SDKChainId.BASE]: baseMainnetRpc,
  [SDKChainId.MAINNET]: mainnetRpc,
  [SDKChainId.OPTIMISM]: optimismMainnetRpc,
  [SDKChainId.SEPOLIA]: baseGoerliRpc, // dummy for now, not used anyway
  [SDKChainId.SONIC]: sonicMainnetRpc,
}
