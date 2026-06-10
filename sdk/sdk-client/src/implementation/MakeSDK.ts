import { createMainRPCClient } from '../rpc/SDKMainClient'
import { SDKManager } from './SDKManager'
import { getApiVersion } from '../utils/getApiVersion'

export type SDKApiVersion = 'v1' | 'v2'

export type MakeSDKParams = { logging?: boolean; version?: SDKApiVersion } & (
  | { apiDomainUrl: string }
  | { apiURL: string }
)

/**
 * Creates a public Summer.fi SDK client ({@link SDKManager}).
 *
 * Accepts either an `apiDomainUrl` or a direct `apiURL`, plus an optional `logging` flag and API
 * `version`. Prefer `apiDomainUrl`, which enables automatic versioning and routing based on the
 * client version.
 *
 * @param params - Connection options: `apiDomainUrl` or `apiURL`, optional `version` and `logging`.
 * @returns A configured {@link SDKManager} instance.
 * @throws Error if neither `apiDomainUrl` nor `apiURL` is provided.
 *
 * @example
 * ```ts
 * const sdk = makeSDK({ apiDomainUrl: 'https://summer.fi' })
 * const chains = await sdk.chains.getSupportedChains()
 * ```
 */
export function makeSDK(params: MakeSDKParams) {
  const apiVersion = getApiVersion(params.version)
  let versionedURL: string
  // url based on domain
  if ('apiDomainUrl' in params) {
    versionedURL = new URL(`/sdk/trpc/${apiVersion}`, params.apiDomainUrl).toString()
  }
  // url based on direct url
  else if ('apiURL' in params) {
    const normalizedUrlWithoutVersion = params.apiURL.replace(/\/+$/, '')
    versionedURL = `${normalizedUrlWithoutVersion}/${apiVersion}`
  } else {
    throw new Error('Either apiDomainUrl or apiURL must be provided')
  }

  const rpcClient = createMainRPCClient({
    apiURL: versionedURL,
    logging: params.logging,
  })

  return new SDKManager({ rpcClient })
}
