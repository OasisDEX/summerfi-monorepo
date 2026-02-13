import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedTokenPrice } from '@/app/server-handlers/token-price'
import { type TokenPriceData } from '@/app/server-handlers/token-price/types'

const fallbackData: TokenPriceData = {
  usd: 0,
  usdMarketCap: 0,
  usd24hVol: 0,
  usd24hChange: 0,
}

export const getCachedSumrPrice = async () => {
  try {
    const config = await getCachedConfig()
    const coingeckoSumrTokenId = config.features?.SumrCoingeckoTokenID ?? 'summer-2'

    return await getCachedTokenPrice(coingeckoSumrTokenId)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching SUMR price data:', error)

    return fallbackData
  }
}
