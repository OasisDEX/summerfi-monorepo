import { createMainRPCClient } from '../rpc/SDKMainClient'
import { SDKManager } from './SDKManager'
import { version as SDK_VERSION } from '../../package.json'

export function makeSDK(params: { apiURL: string; logging?: boolean }) {
  const versionedURL = new URL('v' + SDK_VERSION, params.apiURL).toString()
  const rpcClient = createMainRPCClient(versionedURL, params.logging)

  return new SDKManager({ rpcClient })
}
