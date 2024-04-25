import { CacheableYieldsService, curatedYieldPools, PoolHistory } from '@summerfi/defi-llama-client'
import { Logger } from '@summerfi/abstractions'
import { TokenApyService } from './token-apy-service'
import {
  addDays,
  getTimestamp,
  ONE_DAY,
  SecondTimestamp,
  secondTimestampToShortDate,
  ShortDate,
} from '../helpers'
import { InterestRate, RatesWithAverage } from '../protocols/types'

export interface TokenApyServiceConfig {
  yieldService: CacheableYieldsService
  logger: Logger
}

type EnrichedPoolHistoryEntry = PoolHistory & {
  secondTimestamp: SecondTimestamp
}
export const getTokenApyService = ({
  yieldService,
  logger,
}: TokenApyServiceConfig): TokenApyService => {
  return {
    async getTokenApy(params) {
      const { token, fromTimestamp, toTimestamp } = params
      const { address, symbol } = token
      logger.info(`Getting APY for ${symbol}`)

      if (!(symbol.toUpperCase() in curatedYieldPools)) {
        logger.warn(`No curated yield pool for ${symbol}`)
        return {
          token: { address, symbol },
          rates: new Map(),
        }
      }

      const poolId = curatedYieldPools[symbol.toUpperCase()]

      const { data: poolHistory } = await yieldService.getChartByPool(poolId)

      const relevantData = poolHistory
        .map(
          (entry): EnrichedPoolHistoryEntry => ({
            ...entry,
            secondTimestamp: getTimestamp(new Date(entry.timestamp)),
          }),
        )
        .filter(
          (entry) => entry.secondTimestamp >= fromTimestamp && entry.secondTimestamp <= toTimestamp,
        )
        .reduce((acc, element) => {
          const shortDate = secondTimestampToShortDate(element.secondTimestamp)
          if (!acc.has(shortDate)) {
            acc.set(shortDate, [])
          }
          acc.get(shortDate)?.push(element)
          return acc
        }, new Map<ShortDate, EnrichedPoolHistoryEntry[]>())

      const finalMap = new Map<ShortDate, RatesWithAverage>()

      relevantData.forEach((elements, shortDate) => {
        const rates: InterestRate[] = elements.map((element) => ({
          rate: element.apy,
          type: 'lend',
          fromTimestamp: getTimestamp(shortDate),
          toTimestamp: addDays(getTimestamp(shortDate), 1),
          duration: ONE_DAY,
        }))

        const averageRate =
          elements.reduce((acc, element) => acc + element.apy, 0) / elements.length
        finalMap.set(shortDate, { rates, averageRate })
      })

      return {
        token: { address, symbol },
        rates: finalMap,
      }
    },
  }
}
