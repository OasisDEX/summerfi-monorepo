// import { createArmadaRPCClient } from '../rpc/SDKArmadaClient'
import { createMainRPCClient } from '../rpc/SDKMainClient'
import { SDKManager } from './SDKManager'

export function makeSDK(params: { apiURL: string }) {
  const rpcClient = createMainRPCClient(params.apiURL)

  return new SDKManager({ rpcClient })
}
