import { createMainRPCClient } from '../rpc/SDKMainClient'
import { SDKManager } from './SDKManager'
import { getApiVersion } from '../utils/getApiVersion'

export type SDKApiVersion = 'v1' | 'v2'

export type MakeSDKParams = { logging?: boolean; version?: SDKApiVersion } & (
  | { apiDomainUrl: string }
  | { apiURL: string }
)

/*
 * makeSDK is a factory function that creates an instance of SDKManager.
 * It can take either an apiDomainUrl or a direct apiURL, along with an optional logging flag.
 * Best to use apiDomainUrl as it provide automatic versioning and routing depending on the client version.
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
