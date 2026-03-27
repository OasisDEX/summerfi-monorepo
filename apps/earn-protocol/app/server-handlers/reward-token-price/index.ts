import { type TokenPriceData } from '@summerfi/app-types'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedTokenPrice } from '@/app/server-handlers/cached/get-token-price'

const fallbackData: TokenPriceData = {
  usd: 0,
  usdMarketCap: 0,
  usd24hVol: 0,
  usd24hChange: 0,
}

export const getCachedSumrPrice: () => Promise<TokenPriceData> = async () => {
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

export const getCachedWstethPrice: () => Promise<TokenPriceData> = async () => {
  try {
    const coingeckoWstethTokenId = 'wrapped-steth'

    return await getCachedTokenPrice(coingeckoWstethTokenId)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching WSTETH price data:', error)

    return fallbackData
  }
}

export const getCachedRewardTokenPrice: () => Promise<{
  SUMR: number
  WSTETH: number
}> = async () => {
  const [sumrPrice, wstethPrice] = await Promise.all([getCachedSumrPrice(), getCachedWstethPrice()])

  return {
    SUMR: sumrPrice.usd,
    WSTETH: wstethPrice.usd,
  }
}
