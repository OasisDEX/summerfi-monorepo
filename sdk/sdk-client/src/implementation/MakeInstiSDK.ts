import { createMainRPCClient } from '../rpc/SDKMainClient'
import { SDKAdminManager } from './SDKAdminManager'
import type { MakeSDKParams } from './MakeSDK'
import { getApiVersion } from '../utils/getApiVersion'

/**
 * Institutional deployment-config version. Selects how the server resolves the institution's
 * deployment config (chains + access manager): 'v1' = legacy institutions subgraph, 'v2' = RWA /
 * institutions-v2 subgraph. Sent as the `Insti-Version` header.
 */
export type InstiVersion = 'v1' | 'v2'

export type MakeInstiSDKParams = MakeSDKParams & {
  clientId: string
  /** Defaults to 'v2'. */
  instiVersion?: InstiVersion
}

/*
 * makeInstiSdk is a factory function that creates an admin SDK instance scoped to an institution.
 * It behaves like makeAdminSDK (passes the clientId as the `Client-Id` header) but also forwards an
 * institutional deployment-config version as the `Insti-Version` header (defaults to 'v2'), which the
 * server uses to resolve the institution's deployment config and access manager.
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

  return new SDKAdminManager({ rpcClient })
}
