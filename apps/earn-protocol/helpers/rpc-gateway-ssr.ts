import { NetworkNames, SupportedNetworkIds } from '@summerfi/app-types'

import { getRpcGatewayUrl } from '@/helpers/rpc-gateway'

const mainnetRpc = getRpcGatewayUrl(NetworkNames.ethereumMainnet)
const arbitrumMainnetRpc = getRpcGatewayUrl(NetworkNames.arbitrumMainnet)
const baseMainnetRpc = getRpcGatewayUrl(NetworkNames.baseMainnet)
const sonicMainnetRpc = getRpcGatewayUrl(NetworkNames.sonicMainnet)
const optimismMainnetRpc = getRpcGatewayUrl(NetworkNames.optimismMainnet)

// use this ONLY server side so it doesnt leak to the client
export const SDKChainIdToSSRRpcGatewayMap = {
  [SupportedNetworkIds.ArbitrumOne]: arbitrumMainnetRpc,
  [SupportedNetworkIds.Base]: baseMainnetRpc,
  [SupportedNetworkIds.Mainnet]: mainnetRpc,
  [SupportedNetworkIds.SonicMainnet]: sonicMainnetRpc,
  [SupportedNetworkIds.Optimism]: optimismMainnetRpc,
}
