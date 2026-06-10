import { createMainRPCClient } from '../rpc/SDKMainClient'
import { SDKInstiManager } from './SDKInstiManager'
import type { MakeSDKParams } from './MakeSDK'
import { getApiVersion } from '../utils/getApiVersion'
import type { InstiVersion } from '@summerfi/sdk-common'
/**
 * Institutional deployment-config version. Selects how the server resolves the institution's
 * deployment config (chains + access manager): 'v1' = legacy institutions subgraph, 'v2' = RWA /
 * institutions-v2 subgraph. Sent as the `Insti-Version` header.
 */

export type MakeInstiSDKParams = MakeSDKParams & {
  clientId: string
  /** Defaults to 'v2'. */
  instiVersion?: InstiVersion
}

/**
 * Creates an institutional Summer.fi SDK client ({@link SDKInstiManager}) scoped to an institution.
 *
 * Behaves like {@link makeAdminSDK} (sending `clientId` as the `Client-Id` header) but additionally
 * forwards an institutional deployment-config version as the `Insti-Version` header (defaults to
 * `'v2'`), which the server uses to resolve the institution's deployment config and access manager.
 *
 * @param params - {@link MakeInstiSDKParams}: standard connection options, `clientId`, and an
 *   optional `instiVersion` (defaults to `'v2'`).
 * @returns A configured {@link SDKInstiManager} instance.
 * @throws Error if neither `apiDomainUrl` nor `apiURL` is provided.
 */
export function makeInstiSdk(params: MakeInstiSDKParams) {
  const apiVersion = getApiVersion(params.version)
  const instiVersion: InstiVersion = params.instiVersion ?? 'v2'
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
    clientId: params.clientId,
    instiVersion,
    logging: params.logging,
  })

  return new SDKInstiManager({ rpcClient })
}
