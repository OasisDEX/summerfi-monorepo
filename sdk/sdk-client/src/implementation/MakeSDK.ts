import { createMainRPCClient } from '../rpc/SDKMainClient'
import { SDKManager } from './SDKManager'
import { version as sdkClientVersion } from '../../bundle/package.json'

export type MakeSDKParams = { logging?: boolean } & ({ apiDomainUrl: string } | { apiURL: string })

/*
 * makeSDK is a factory function that creates an instance of SDKManager.
 * It can take either an apiDomainUrl or a direct apiURL, along with an optional logging flag.
 * Best to use apiDomainUrl as it provide automatic versioning and routing depending on the client version.
 */
export function makeSDK(params: MakeSDKParams) {
  const apiVersion = `v${sdkClientVersion.charAt(0)}`
  let versionedURL: string
  if ('apiDomainUrl' in params) {
    // url based on direct url
    versionedURL = new URL(`/api/sdk/${apiVersion}`, params.apiDomainUrl).toString()
  } else if ('apiURL' in params) {
    // url based on domain
    const apiUrlNormalized = params.apiURL.replace(/\/+$/, '')
    versionedURL = `${apiUrlNormalized}/${apiVersion}`
  } else {
    throw new Error('Either apiDomainUrl or apiURL must be provided')
  }

  const rpcClient = createMainRPCClient(versionedURL, params.logging)

  return new SDKManager({ rpcClient })
}
