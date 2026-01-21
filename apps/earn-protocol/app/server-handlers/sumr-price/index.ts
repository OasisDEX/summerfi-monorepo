import { unstable_cache as unstableCache } from 'next/cache'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { type SumrPriceData } from '@/app/server-handlers/sumr-price/types'

const fallbackData: SumrPriceData = {
  usd: 0,
  usdMarketCap: 0,
  usd24hVol: 0,
  usd24hChange: 0,
}

const getSumrPrice = async () => {
  const config = await getCachedConfig()
  const coingeckoSumrTokenId = config.features?.SumrCoingeckoTokenID ?? 'summer-2'
  // check envs
  const { COINGECKO_API_URL, COINGECKO_API_VERSION, COINGECKO_API_KEY, COINGECKO_API_AUTH_HEADER } =
    process.env

  if (
    !COINGECKO_API_URL ||
    !COINGECKO_API_VERSION ||
    !COINGECKO_API_KEY ||
    !COINGECKO_API_AUTH_HEADER
  ) {
    const missingEnvs = [
      !COINGECKO_API_URL && 'COINGECKO_API_URL',
      !COINGECKO_API_VERSION && 'COINGECKO_API_VERSION',
      !COINGECKO_API_KEY && 'COINGECKO_API_KEY',
      !COINGECKO_API_AUTH_HEADER && 'COINGECKO_API_AUTH_HEADER',
    ]
      .filter(Boolean)
      .join(', ')

    throw new Error(`Missing required environment variables for CoinGecko API ${missingEnvs}`)
  }

  // request
  const url = new URL(`${COINGECKO_API_URL}/${COINGECKO_API_VERSION}/simple/price`)

  url.searchParams.append('vs_currencies', 'usd')
  url.searchParams.append('ids', coingeckoSumrTokenId)
  url.searchParams.append('include_market_cap', 'true')
  url.searchParams.append('include_24hr_vol', 'true')
  url.searchParams.append('include_24hr_change', 'true')
  url.searchParams.append('precision', 'full')

  const reqUrl = url.toString()

  const response = await fetch(reqUrl, {
    method: 'GET',
    headers: {
      [COINGECKO_API_AUTH_HEADER]: COINGECKO_API_KEY,
    },
  })

  if (!response.ok) {
    const errorBody = await response.text()

    throw new Error(
      `CoinGecko API request (${reqUrl}) failed with status ${response.status}: ${response.statusText} - ${errorBody}`,
    )
  }

  try {
    const data = await response.json()
    const sumrTokenData = data[coingeckoSumrTokenId]

    return {
      usd: Number(sumrTokenData.usd),
      usdMarketCap: Number(sumrTokenData.usd_market_cap),
      usd24hVol: Number(sumrTokenData.usd_24h_vol),
      usd24hChange: Number(sumrTokenData.usd_24h_change),
    } as SumrPriceData
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to parse CoinGecko API response: ${error}`)

    return fallbackData
  }
}

export const getCachedSumrPrice = async () => {
  try {
    return await unstableCache<() => Promise<SumrPriceData>>(getSumrPrice, ['sumrPriceData'], {
      revalidate: 60, // 1 minutes
    })()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching SUMR price data:', error)

    return fallbackData
  }
}
