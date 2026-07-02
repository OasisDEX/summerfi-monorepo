import { createMainRPCClient } from '../rpc/SDKMainClient'
import type { MakeSDKParams } from './MakeSDK'
import { getApiVersion } from '../utils/getApiVersion'
import { SDKInstiManager } from './SDKInstiManager'

export type MakeAdminSDKParams = MakeSDKParams & { clientId: string }

/**
 * Creates a managed (admin) Summer.fi SDK client ({@link SDKInstiManager}) scoped to a client id.
 *
 * Behaves like {@link makeSDK} but forwards the `clientId` as the `Client-Id` header, unlocking the
 * admin/access-control surface. Accepts either an `apiDomainUrl` or a direct `apiURL`; prefer
 * `apiDomainUrl` for automatic versioning and routing.
 *
 * @param params - {@link MakeSDKParams} connection options plus the `clientId` to authenticate as.
 * @returns A configured {@link SDKInstiManager} instance.
 * @throws Error if neither `apiDomainUrl` nor `apiURL` is provided.
 */
export function makeAdminSDK(params: MakeAdminSDKParams) {
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
    clientId: params.clientId,
    instiVersion: 'v1',
    logging: params.logging,
  })

  return new SDKInstiManager({ rpcClient })
}
