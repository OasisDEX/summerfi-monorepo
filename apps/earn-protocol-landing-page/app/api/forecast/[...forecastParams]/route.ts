/* eslint-disable camelcase */
import { fetchForecastData, parseForecastDatapoints } from '@summerfi/app-earn-ui'
import { type ForecastData, type PositionForecastAPIResponse } from '@summerfi/app-types'
import { isSupportedSDKChain } from '@summerfi/app-utils'
import { isValidAddress } from '@summerfi/serverless-shared'
import { NextResponse } from 'next/server'

export const revalidate = 60

// Simple in-memory cache
const cache = {} as {
  [key: string /** timestamp */]:
    | {
        data: ForecastData
        timestamp: number
      }
    | undefined
}
const CACHE_TTL = 30 * 1000 // half a minute

export async function GET(req: Request, { params }: { params: { forecastParams: string[] } }) {
  const [fleetAddress, chainId, amount] = params.forecastParams

  if (!fleetAddress || !chainId || !amount) {
    return NextResponse.json({ error: 'Invalid forecast params' }, { status: 400 })
  }

  if (!isValidAddress(fleetAddress)) {
    return NextResponse.json({ error: 'Invalid fleet address' }, { status: 400 })
  }

  if (!isSupportedSDKChain(Number(chainId))) {
    return NextResponse.json({ error: 'Invalid chain ID' }, { status: 400 })
  }

  if (Number.isNaN(Number(amount)) || Number(amount) <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  const cacheKey = `${fleetAddress}-${chainId}-${amount}`
  const cachedResult = cache[cacheKey]

  if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
    return NextResponse.json(cachedResult.data)
  }

  const amountParsed = Number(amount)

  try {
    const response = await fetchForecastData({
      fleetAddress,
      chainId: Number(chainId),
      amount: amountParsed,
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch forecast data' }, { status: 500 })
    }
    const forecastData = (await response.json()) as PositionForecastAPIResponse | undefined

    if (!forecastData) {
      return NextResponse.json(
        { error: 'Failed to fetch and parse forecast data' },
        { status: 500 },
      )
    }

    const parsedData = parseForecastDatapoints(forecastData)

    // Store the result in the cache
    // There is no race condition here, as the cache is a simple in-memory object
    // eslint-disable-next-line require-atomic-updates
    cache[cacheKey] = {
      data: parsedData,
      timestamp: Date.now(),
    }

    return NextResponse.json(parsedData)
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while fetching forecast data' },
      { status: 500 },
    )
  }
}
