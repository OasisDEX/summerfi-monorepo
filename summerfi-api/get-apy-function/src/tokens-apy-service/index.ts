import { CacheableYieldsService, curatedYieldPools, PoolHistory } from '@summerfi/defi-llama-client'
import { Logger } from '@summerfi/abstractions'
import { TokenApyService } from './token-apy-service'
import {
  daysAgo,
  getShortDate,
  getTimestamp,
  oneYearAgo,
  secondTimestampToDate,
  ShortDate,
} from '../helpers'

export interface TokenApyServiceConfig {
  yieldService: CacheableYieldsService
  logger: Logger
}

type EnrichedPoolHistoryEntry = PoolHistory & {
  date: Date
}
export const getTokenApyService = ({
  yieldService,
  logger,
}: TokenApyServiceConfig): TokenApyService => {
  return {
    async getTokenApy(params) {
      const { token, referenceDate } = params
      const { address, symbol } = token
      logger.info(`Getting APY for ${symbol} at ${referenceDate.toISOString()}`)

      if (!(symbol.toUpperCase() in curatedYieldPools)) {
        logger.warn(`No curated yield pool for ${symbol}`)
        return {
          token: { address, symbol },
          rates: {
            apy1d: 0,
            apy7d: 0,
            apy30d: 0,
            apy90d: 0,
            apy365d: 0,
          },
        }
      }

      const poolId = curatedYieldPools[symbol.toUpperCase()]

      const { data: poolHistory } = await yieldService.getChartByPool(poolId)

      const firstDate = secondTimestampToDate(oneYearAgo(referenceDate))

      const relevantData = poolHistory
        .map(
          (entry): EnrichedPoolHistoryEntry => ({
            ...entry,
            date: new Date(entry.timestamp),
          }),
        )
        .filter((entry) => entry.date >= firstDate && entry.date <= referenceDate)
        .reduce((acc, element) => {
          const shortDate = getShortDate(element.date)
          if (!acc.has(shortDate)) {
            acc.set(shortDate, [])
          }
          acc.get(shortDate)?.push(element)
          return acc
        }, new Map<ShortDate, EnrichedPoolHistoryEntry[]>())

      const perDay = Array.from(relevantData.entries()).map(([date, elements]) => {
        const total = elements.reduce((acc, element) => acc + element.apy, 0)
        const apy = total / elements.length

        return { date, apy, timestamp: getTimestamp(date) }
      })

      const timestamp7daysAgo = daysAgo(referenceDate, 7)
      const timestamp30daysAgo = daysAgo(referenceDate, 30)
      const timestamp90daysAgo = daysAgo(referenceDate, 90)

      const apy7d =
        perDay
          .filter((entry) => entry.timestamp >= timestamp7daysAgo)
          .reduce((acc, entry) => acc + entry.apy, 0) / 7
      const apy30d =
        perDay
          .filter((entry) => entry.timestamp >= timestamp30daysAgo)
          .reduce((acc, entry) => acc + entry.apy, 0) / 30
      const apy90d =
        perDay
          .filter((entry) => entry.timestamp >= timestamp90daysAgo)
          .reduce((acc, entry) => acc + entry.apy, 0) / 90
      const apy365d = perDay.reduce((acc, entry) => acc + entry.apy, 0) / perDay.length

      const apy1d =
        perDay.find((entry) => entry.timestamp === getTimestamp(getShortDate(referenceDate)))
          ?.apy ?? 0

      return {
        token: { address, symbol },
        rates: {
          apy1d,
          apy7d,
          apy30d,
          apy90d,
          apy365d,
        },
      }
    },
  }
}
