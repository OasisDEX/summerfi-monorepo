import { createEarnProtocolRPCClient } from '../rpc/SDKEarnProtocolClient'
import { createMainRPCClient } from '../rpc/SDKMainClient'
import { SDKManager } from './SDKManager'

export function makeSDK(params: { apiURL: string; earnProtocolEndpointUrl?: string }) {
  const rpcClient = createMainRPCClient(params.apiURL)
  const earnProtocolClient = params.earnProtocolEndpointUrl
    ? createEarnProtocolRPCClient(params.earnProtocolEndpointUrl)
    : undefined

  return new SDKManager({ rpcClient, earnProtocolClient })
}
