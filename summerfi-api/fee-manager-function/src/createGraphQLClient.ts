import { GraphQLClient } from 'graphql-request'
import { ChainId, ProtocolId } from '@summerfi/serverless-shared'
import { getAaveLikePosition, getAaveLikeSubgraphNameByChainId } from './clients/aave-like-client'
import { getAjnaPosition, getAjnaSubgraphNameByChainId } from './clients/ajna-v2-client'
import type { IFeeManagerClient } from './interfaces'

const getSubgraphName = (chainId: ChainId, protocolId: ProtocolId): string => {
  switch (protocolId) {
    case ProtocolId.AAVE_V2:
    case ProtocolId.AAVE_V3:
    case ProtocolId.AAVE3:
    case ProtocolId.SPARK:
      return getAaveLikeSubgraphNameByChainId(chainId)
    case ProtocolId.AJNA:
      return getAjnaSubgraphNameByChainId(chainId)
    default:
      throw new Error(`No subgraph assigned to Protocol ID ${protocolId}`)
  }
}

const validateChainId = (chainId: ChainId): void => {
  const supportedChains = [ChainId.MAINNET, ChainId.ARBITRUM, ChainId.BASE, ChainId.OPTIMISM]
  if (!supportedChains.includes(chainId)) {
    throw new Error(
      `Chain ID ${chainId} is not supported. Supported chains are: ${supportedChains.join(', ')}`,
    )
  }
}

const validateProtocolId = (protocolId: ProtocolId): void => {
  const supportedProtocols = [
    ProtocolId.AAVE_V2,
    ProtocolId.AAVE_V3,
    ProtocolId.AAVE3,
    ProtocolId.SPARK,
    ProtocolId.AJNA,
  ]
  if (!supportedProtocols.includes(protocolId)) {
    throw new Error(
      `Protocol ID ${protocolId} is not supported. Supported protocols are: ${supportedProtocols.join(', ')}`,
    )
  }
}

export const createGraphQLClient = (
  chainId: ChainId,
  protocolId: ProtocolId,
  baseUrl: string,
): IFeeManagerClient => {
  validateChainId(chainId)
  validateProtocolId(protocolId)
  const subgraphName = getSubgraphName(chainId, protocolId)
  const url = `${baseUrl}/${subgraphName}`
  const client = new GraphQLClient(url)

  const GetPosition = async (id: string) => {
    switch (protocolId) {
      case ProtocolId.AAVE_V2:
      case ProtocolId.AAVE_V3:
      case ProtocolId.AAVE3:
      case ProtocolId.SPARK:
        return getAaveLikePosition(client, id)
      case ProtocolId.AJNA:
        return getAjnaPosition(client, id)

      default:
        throw new Error(`No subgraph assigned to Protocol ID ${protocolId}`)
    }
  }

  return {
    GetPosition,
  }
}
