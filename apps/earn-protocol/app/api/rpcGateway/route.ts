import { type AppConfigType, NetworkNames } from '@summerfi/app-types'
import { type NextRequest, NextResponse } from 'next/server'

import { configFetcher } from '@/app/server-handlers/system-config/calls/config'

let cachedConfig: Partial<AppConfigType> | undefined
let cacheExpirationTime: number | undefined

/**
 * Retrieve remote configuration with caching mechanism.
 *
 * @param cacheTime - The duration (in milliseconds) for which the cached configuration should be considered valid. Defaults to 0.
 * @returns A promise that resolves to a partial application configuration.
 *
 * @remarks
 * This function fetches the remote configuration data and caches it for a specified duration. If the cached configuration is still valid,
 * it returns the cached configuration instead of fetching it again. If the fetch operation fails, it throws an error.
 */
async function getRemoteConfigWithCache(cacheTime = 0): Promise<Partial<AppConfigType>> {
  if (cachedConfig && Date.now() < (cacheExpirationTime ?? 0)) {
    return cachedConfig
  }
  let configResponse

  try {
    configResponse = await configFetcher()
  } catch (e) {
    throw new Error('Failed to fetch config data')
  }

  // eslint-disable-next-line require-atomic-updates
  cachedConfig = configResponse
  // eslint-disable-next-line require-atomic-updates
  cacheExpirationTime = Date.now() + cacheTime

  return configResponse
}

const configCacheTime = {
  frontend: 60 * 2, // 2 minutes
  backend: 60 * 5, // 5 minutes
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
async function getRpcGatewayUrl(networkName: NetworkNames) {
  try {
    const { rpcConfig } = await getRemoteConfigWithCache(1000 * configCacheTime.backend)
    const rpcBase = getRpcGatewayBaseUrl()

    if (!rpcConfig) {
      throw new Error('Failed to retrieve RPC config or base URL')
    }

    return resolveRpcGatewayUrl(networkName, rpcConfig, rpcBase)
  } catch (e) {
    return undefined
  }
}

/**
 * Handles RPC requests.
 * @param req - The Next.js API request object.
 * @returns The resolved response from the RPC gateway.
 */
export async function POST(req: NextRequest) {
  const networkQuery = req.nextUrl.searchParams.get('network')

  if (!networkQuery) {
    return NextResponse.json({ error: 'Missing network query' }, { status: 400 })
  }
  const networkName = networkQuery.toString() as NetworkNames
  const rpcGatewayUrl = await getRpcGatewayUrl(networkName)

  if (!rpcGatewayUrl) {
    return NextResponse.json({ error: 'Invalid network or RPC Config is missing' }, { status: 400 })
  }
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Connection: 'keep-alive',
      'Content-Length': '',
    },
  }

  const body = JSON.stringify(await req.json())

  const request = new Request(rpcGatewayUrl, {
    method: req.method,
    body,
    headers: {
      ...config.headers,
      'Content-Length': body.length.toString(),
    },
  })
  const response = await fetch(request)

  if (response.status !== 200) {
    return NextResponse.json({ error: response.statusText }, { status: response.status })
  }
  const resolvedResponse = await response.json()

  return NextResponse.json(resolvedResponse, { status: 200 })
}
