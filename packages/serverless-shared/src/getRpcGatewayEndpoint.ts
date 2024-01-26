import { ChainId, NetworkByChainID } from './domain-types'

export interface IRpcConfig {
  skipCache: boolean
  skipMulticall: boolean
  skipGraph: boolean
  stage: string
  source: string
}

export function getRpcGatewayEndpoint(
  rpcGatewayUrl: string,
  chainId: ChainId,
  rpcConfig: IRpcConfig,
) {
  const network = NetworkByChainID[chainId]
  return (
    `${rpcGatewayUrl}/?` +
    `network=${network}&` +
    `skipCache=${rpcConfig.skipCache}&` +
    `skipMulticall=${rpcConfig.skipMulticall}&` +
    `skipGraph=${rpcConfig.skipGraph}&` +
    `source=${rpcConfig.source}`
  )
}
