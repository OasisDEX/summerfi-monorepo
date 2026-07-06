import { NetworkNames, SupportedNetworkIds } from '@summerfi/app-types'

import { getRpcGatewayUrl } from '@/helpers/rpc-gateway'

const mainnetRpc = getRpcGatewayUrl(NetworkNames.ethereumMainnet)
const arbitrumMainnetRpc = getRpcGatewayUrl(NetworkNames.arbitrumMainnet)
const baseMainnetRpc = getRpcGatewayUrl(NetworkNames.baseMainnet)
const sonicMainnetRpc = getRpcGatewayUrl(NetworkNames.sonicMainnet)
const hyperliquidRpc = getRpcGatewayUrl(NetworkNames.hyperliquid)

// use this ONLY server side so it doesnt leak to the client
// NOTE: unlike the canonical `@summerfi/ssr-public-client` version, this app's `getRpcGatewayUrl`
// (helpers/rpc-gateway.ts) is async (it fetches remote config), so these map values are Promises,
// not resolved strings — callers (get-ssr-public-client.ts) `await` the lookup.
export const SDKChainIdToSSRRpcGatewayMap: {
  [key in SupportedNetworkIds]: Promise<string | undefined>
} = {
  [SupportedNetworkIds.ArbitrumOne]: arbitrumMainnetRpc,
  [SupportedNetworkIds.Base]: baseMainnetRpc,
  [SupportedNetworkIds.Mainnet]: mainnetRpc,
  [SupportedNetworkIds.SonicMainnet]: sonicMainnetRpc,
  [SupportedNetworkIds.Hyperliquid]: hyperliquidRpc,
}
