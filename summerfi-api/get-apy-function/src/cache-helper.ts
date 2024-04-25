import { DistributedCache, Logger } from '@summerfi/abstractions'
import { ChainId, ProtocolId, serialize } from '@summerfi/serverless-shared'

export const saveSubgraphResponsesToCache = async (params: {
  subgraphResult: unknown
  cacheKey: string
  logger: Logger
  cache: DistributedCache
  protocolId: ProtocolId
  chainId: ChainId
}) => {
  const { subgraphResult, cacheKey, logger, cache, protocolId, chainId } = params
  const serialized = serialize(subgraphResult)
  if (!serialized) {
    logger.error('Failed to serialize rates', { cacheKey, protocolId, chainId })
    return
  }

  await cache.set(cacheKey, serialized)
}
