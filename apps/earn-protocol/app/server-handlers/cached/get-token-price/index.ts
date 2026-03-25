import { unstable_cache as unstableCache } from 'next/cache'

import { getTokenPrice, tokenPriceFallbackData } from '@/app/server-handlers/token-price'
import { type TokenPriceData } from '@/app/server-handlers/token-price/types'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'

export const getCachedTokenPrice = async (tokenId: string) => {
  try {
    return await unstableCache<() => Promise<TokenPriceData>>(
      () => getTokenPrice({ tokenId }),
      ['tokenPrice'],
      {
        revalidate: CACHE_TIMES.TOKEN_PRICE,
        tags: [CACHE_TAGS.TOKEN_PRICE],
      },
    )()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching ${tokenId} price data:`, error)

    return tokenPriceFallbackData
  }
}
