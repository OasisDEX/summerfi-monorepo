import { NetworkNames, SupportedNetworkIds } from '@summerfi/app-types'

import { getRpcGatewayUrl } from '@/helpers/rpc-gateway'

const mainnetRpc = await getRpcGatewayUrl(NetworkNames.ethereumMainnet)
const arbitrumMainnetRpc = await getRpcGatewayUrl(NetworkNames.arbitrumMainnet)
const baseMainnetRpc = await getRpcGatewayUrl(NetworkNames.baseMainnet)
const sonicMainnetRpc = await getRpcGatewayUrl(NetworkNames.sonicMainnet)
const hyperliquidRpc = await getRpcGatewayUrl(NetworkNames.hyperliquid)

// use this ONLY server side so it doesnt leak to the client
export const SDKChainIdToSSRRpcGatewayMap = {
  [SupportedNetworkIds.ArbitrumOne]: arbitrumMainnetRpc,
  [SupportedNetworkIds.Base]: baseMainnetRpc,
  [SupportedNetworkIds.Mainnet]: mainnetRpc,
  [SupportedNetworkIds.SonicMainnet]: sonicMainnetRpc,
  [SupportedNetworkIds.Hyperliquid]: hyperliquidRpc,
}
