import { createMainRPCClient } from '../rpc/SDKMainClient'
import { SDKManager } from './SDKManager'
import { version as sdkClientVersion } from '../../bundle/package.json'

export function makeSDK(params: { apiURL: string; logging?: boolean; apiDomain?: string }) {
  const apiVersion = `v${sdkClientVersion.charAt(0)}`
  let versionedURL: string
  if (params.apiDomain) {
    // url based on direct url
    versionedURL = new URL(`/api/sdk/${apiVersion}`, params.apiDomain).toString()
  } else {
    // url based on domain
    const apiUrlNormalized = params.apiURL.replace(/\/+$/, '')
    versionedURL = `${apiUrlNormalized}/${apiVersion}`
  }

  const rpcClient = createMainRPCClient(versionedURL, params.logging)

  return new SDKManager({ rpcClient })
}
