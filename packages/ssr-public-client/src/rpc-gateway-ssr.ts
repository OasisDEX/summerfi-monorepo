import { NetworkNames, SDKChainId } from '@summerfi/app-types'

import { getRpcGatewayUrl } from './rpc-gateway'

const mainnetRpc = getRpcGatewayUrl(NetworkNames.ethereumMainnet)
const arbitrumMainnetRpc = getRpcGatewayUrl(NetworkNames.arbitrumMainnet)
const optimismMainnetRpc = getRpcGatewayUrl(NetworkNames.optimismMainnet)
const baseMainnetRpc = getRpcGatewayUrl(NetworkNames.baseMainnet)
const baseGoerliRpc = getRpcGatewayUrl(NetworkNames.baseGoerli)
const sonicMainnetRpc = getRpcGatewayUrl(NetworkNames.sonicMainnet)

export const SDKChainIdToSSRRpcGatewayMap: { [key in SDKChainId]: string | undefined } = {
  [SDKChainId.ARBITRUM]: arbitrumMainnetRpc,
  [SDKChainId.BASE]: baseMainnetRpc,
  [SDKChainId.MAINNET]: mainnetRpc,
  [SDKChainId.OPTIMISM]: optimismMainnetRpc,
  [SDKChainId.SEPOLIA]: baseGoerliRpc, // dummy for now, not used anyway
  [SDKChainId.SONIC]: sonicMainnetRpc,
}
