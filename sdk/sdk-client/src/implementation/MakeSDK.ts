import { createRPCClient } from '../rpc/SDKClient'
import { SDKManager } from './SDKManager'

export function makeSDK(params: { apiURL: string }) {
  const rpcClient = createRPCClient(params.apiURL)
  return new SDKManager({ rpcClient })
}
