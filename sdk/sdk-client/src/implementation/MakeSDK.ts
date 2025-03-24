// import { createArmadaRPCClient } from '../rpc/SDKArmadaClient'
import { createMainRPCClient } from '../rpc/SDKMainClient'
import { SDKManager } from './SDKManager'

export function makeSDK(params: { apiURL: string; logging?: boolean }) {
  const rpcClient = createMainRPCClient(params.apiURL, params.logging)

  return new SDKManager({ rpcClient })
}
