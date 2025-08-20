import { NetworkNames, SupportedNetworkIds } from '@summerfi/app-types'

import { getRpcGatewayUrl } from './rpc-gateway'

const mainnetRpc = getRpcGatewayUrl(NetworkNames.ethereumMainnet)
const arbitrumMainnetRpc = getRpcGatewayUrl(NetworkNames.arbitrumMainnet)
const baseMainnetRpc = getRpcGatewayUrl(NetworkNames.baseMainnet)
const sonicMainnetRpc = getRpcGatewayUrl(NetworkNames.sonicMainnet)

export const SDKChainIdToSSRRpcGatewayMap: { [key in SupportedNetworkIds]: string | undefined } = {
  [SupportedNetworkIds.ArbitrumOne]: arbitrumMainnetRpc,
  [SupportedNetworkIds.Base]: baseMainnetRpc,
  [SupportedNetworkIds.Mainnet]: mainnetRpc,
  [SupportedNetworkIds.SonicMainnet]: sonicMainnetRpc,
}
