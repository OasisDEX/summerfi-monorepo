// import { createArmadaRPCClient } from '../rpc/SDKArmadaClient'
import { createMainRPCClient } from '../rpc/SDKMainClient'
import { SDKManager } from './SDKManager'

if (!process.env.SDK_VERSION) {
  throw new Error('SDK_VERSION is not set in environment variables')
}

export function makeSDK(params: { apiURL: string; logging?: boolean }) {
  const rpcClient = createMainRPCClient(params.apiURL + process.env.SDK_VERSION, params.logging)

  return new SDKManager({ rpcClient })
}
