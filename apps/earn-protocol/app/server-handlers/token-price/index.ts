import { unstable_cache as unstableCache } from 'next/cache'

import { type TokenPriceData } from '@/app/server-handlers/token-price/types'

const fallbackData: TokenPriceData = {
  usd: 0,
  usdMarketCap: 0,
  usd24hVol: 0,
  usd24hChange: 0,
}

const getTokenPrice = async ({ tokenId }: { tokenId: string }) => {
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
  url.searchParams.append('ids', tokenId)
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
    const tokenData = data[tokenId]

    return {
      usd: Number(tokenData.usd),
      usdMarketCap: Number(tokenData.usd_market_cap),
      usd24hVol: Number(tokenData.usd_24h_vol),
      usd24hChange: Number(tokenData.usd_24h_change),
    } as TokenPriceData
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to parse CoinGecko API response: ${error}`)

    return fallbackData
  }
}

export const getCachedTokenPrice = async (tokenId: string) => {
  try {
    return await unstableCache<() => Promise<TokenPriceData>>(
      () => getTokenPrice({ tokenId }),
      [`${tokenId}PriceData`],
      {
        revalidate: 60, // 1 minutes
      },
    )()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching ${tokenId} price data:`, error)

    return fallbackData
  }
}
