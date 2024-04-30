import { DistributedCache, Logger } from '@summerfi/abstractions'
import { PoolHistoryResponse, PoolsResponse } from './types'

export interface CacheableYieldsService {
  getPools: () => Promise<PoolsResponse>
  getChartByPool: (pool: string) => Promise<PoolHistoryResponse>
}

function checkIfIsPoolsResponse(data: unknown): data is PoolsResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'status' in data &&
    'data' in data &&
    Array.isArray(data.data)
  )
}

function checkIfIsPoolHistoryResponse(data: unknown): data is PoolHistoryResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'status' in data &&
    'data' in data &&
    Array.isArray(data.data) &&
    data.data.length > 0 &&
    'timestamp' in data.data[0] &&
    'tvlUsd' in data.data[0] &&
    'apy' in data.data[0]
  )
}

export function getCachableYieldService(
  cache: DistributedCache,
  logger: Logger,
): CacheableYieldsService {
  const poolsKey = 'yields-pools'

  return {
    getPools: async () => {
      const cached = await cache.get(poolsKey)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (checkIfIsPoolsResponse(parsed)) {
          return parsed
        } else {
          logger.warn('Invalid cache data for DefiLlama pools response', { cached })
        }
      }

      const pools = await fetch('https://yields.llama.fi/pools').then((res) => res.json())

      if (!checkIfIsPoolsResponse(pools)) {
        logger.error('Invalid response from DefiLlama service', { pools: pools })
        throw new Error('Invalid response from DefiLlama service')
      }

      await cache.set(poolsKey, JSON.stringify(pools))
      return pools
    },
    getChartByPool: async (pool: string) => {
      const key = `yields-chart-${pool}`
      const cached = await cache.get(key)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (checkIfIsPoolHistoryResponse(parsed)) {
          return parsed
        } else {
          logger.warn('Invalid cache data for DefiLlama chart response', { response: parsed })
        }
      }

      const poolResponse = await fetch(`https://yields.llama.fi/chart/${pool}`).then((res) =>
        res.json(),
      )
      // const poolResult = await YieldsService.getChartByPool({ pool: pool })
      if (!checkIfIsPoolHistoryResponse(poolResponse)) {
        logger.error('Invalid response from DefiLlama service', { poolResult: poolResponse })
        throw new Error('Invalid response from DefiLlama service')
      }
      await cache.set(key, JSON.stringify(poolResponse))
      return poolResponse
    },
  }
}
