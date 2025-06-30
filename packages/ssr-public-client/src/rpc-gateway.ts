import { type AppConfigType, NetworkNames } from '@summerfi/app-types'

/**
 * RPC configuration for the RPC Gateway
 */
const rpcConfig: AppConfigType['rpcConfig'] = {
  skipCache: false,
  skipMulticall: false,
  skipGraph: true,
  stage: 'prod',
  source: 'borrow-prod',
}

/**
 * Resolves the RPC node for the given network.
 * @param network - The name of the network.
 * @param rpcConfig - The RPC config.
 * @param rpcBase - The RPC Base string.
 * @returns The RPC node URL or undefined if the network is not supported.
 */
function resolveRpcGatewayUrl(
  network: NetworkNames,
  rpcConfig: AppConfigType['rpcConfig'],
  rpcBase: string,
): string {
  const supportedNetworks = Object.values(NetworkNames)

  if (!supportedNetworks.includes(network)) {
    // eslint-disable-next-line no-console
    console.error(`Network: ${network} is not supported. Returning BadRequest`)

    throw new Error('Network is not supported')
  }

  return (
    `${rpcBase}/?` +
    `network=${network}&` +
    `skipCache=${rpcConfig.skipCache}&` +
    `skipMulticall=${rpcConfig.skipMulticall}&` +
    `skipGraph=${rpcConfig.skipGraph}&` +
    `source=${rpcConfig.source}`
  )
}

/**
 * Retrieves the base URL for the RPC gateway.
 * @returns The base URL for the RPC gateway.
 * @throws If the RPC Gateway URL is not defined.
 */
function getRpcGatewayBaseUrl() {
  const rpcGatewayUrl = process.env.RPC_GATEWAY

  if (!rpcGatewayUrl) {
    throw new Error('RPC Gateway URL is not defined')
  }

  return `${rpcGatewayUrl}`
}

/**
 * Retrieves the RPC gateway URL for the specified network.
 * @param networkName - The name of the network.
 * @throws If the RPC config is not defined.
 * @returns The RPC gateway URL.
 */
export function getRpcGatewayUrl(networkName: NetworkNames): string | undefined {
  try {
    const rpcBase = getRpcGatewayBaseUrl()

    if (!rpcConfig) {
      throw new Error('Failed to retrieve RPC config or base URL')
    }

    return resolveRpcGatewayUrl(networkName, rpcConfig, rpcBase)
  } catch (e) {
    return undefined
  }
}
