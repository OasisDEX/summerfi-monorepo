// import { createArmadaRPCClient } from '../rpc/SDKArmadaClient'
import { createMainRPCClient } from '../rpc/SDKMainClient'
import { SDKManager } from './SDKManager'

// TODO
if (!process.env.SDK_VERSION) {
  throw Error('')
}

export function makeSDK(params: { apiURL: string; logging?: boolean }) {
  const rpcClient = createMainRPCClient(params.apiURL + process.env.SDK_VERSION, params.logging)

  return new SDKManager({ rpcClient })
}
