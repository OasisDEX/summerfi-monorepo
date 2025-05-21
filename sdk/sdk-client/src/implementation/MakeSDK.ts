import { createMainRPCClient } from '../rpc/SDKMainClient'
import { SDKManager } from './SDKManager'
import { version as sdkClientVersion } from '../../bundle/package.json'

export function makeSDK(params: { apiURL: string; logging?: boolean }) {
  const versionedURL = new URL(`/api/sdk/v${sdkClientVersion.charAt(0)}`, params.apiURL).toString()
  const rpcClient = createMainRPCClient(versionedURL, params.logging)

  return new SDKManager({ rpcClient })
}
