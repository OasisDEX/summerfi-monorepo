/* eslint-disable camelcase */
import {
  type ForecastData,
  type ForecastDataPoint,
  isSupportedSDKChain,
  type PositionForecastAPIResponse,
} from '@summerfi/app-types'
import { isValidAddress } from '@summerfi/serverless-shared'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { NextResponse } from 'next/server'

dayjs.extend(weekOfYear)

export const revalidate = 60

const timestampFormat = 'YYYY-MM-DD'

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

export async function GET(req: Request, { params }: { params: { forecastParams: string } }) {
  const forecastApiUrl = process.env.FORECAST_API_URL

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

  if (isNaN(Number(amount)) || Number(amount) <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  if (!forecastApiUrl) {
    return NextResponse.json({ error: 'Forecast API URL is not set' }, { status: 500 })
  }

  const cacheKey = `${fleetAddress}-${chainId}-${amount}`
  const cachedResult = cache[cacheKey]

  if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
    return NextResponse.json(cachedResult.data)
  }

  const amountParsed = Number(amount)

  const response = await fetch(forecastApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fleet_commander_address: fleetAddress,
      position_size: amountParsed,
      chain_id: Number(chainId),
    }),
  })

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch forecast data' }, { status: 500 })
  }

  const forecastData = (await response.json()) as PositionForecastAPIResponse | undefined

  if (!forecastData) {
    return NextResponse.json({ error: 'Failed to fetch and parse forecast data' }, { status: 500 })
  }

  const daily: ForecastDataPoint = []
  const weekly: ForecastDataPoint = []
  const monthly: ForecastDataPoint = []

  const seriesKeyed = forecastData.forecast.series.reduce(
    (acc, series) => {
      acc[series.name] = series.data

      return acc
    },
    {} as { [key in PositionForecastAPIResponse['forecast']['series'][number]['name']]: number[] },
  )

  // originally that was reduced separately for each series, but it was pretty slow (300ms+ for 3y worth of points)
  // this runs the same data through at once, and is much faster (10-50ms for 3y worth of points) + its cached

  const addedWeeklyPointsMap = new Map<string, boolean>()
  const addedMonthlyPointsMap = new Map<string, boolean>()

  forecastData.forecast.timestamps.forEach((timestamp, timestampIndex) => {
    const weekDate = dayjs(timestamp).startOf('week').format(timestampFormat)
    const monthDate = dayjs(timestamp).startOf('month').format(timestampFormat)

    const pointData = {
      // for BandedChart (used in forecast) we need to have a main value
      // "forecast" is the main value, "bounds" are the lower and upper bounds (an array of values)
      forecast: Number(seriesKeyed.forecast[timestampIndex]),
      bounds: [
        Number(seriesKeyed.lower_bound[timestampIndex]),
        Number(seriesKeyed.upper_bound[timestampIndex]),
      ] as [number, number],
    }

    daily.push({
      timestamp,
      ...pointData,
    })

    if (!addedWeeklyPointsMap.has(weekDate)) {
      addedWeeklyPointsMap.set(weekDate, true)
      weekly.push({
        timestamp: weekDate,
        ...pointData,
      })
    }
    if (!addedMonthlyPointsMap.has(monthDate)) {
      addedMonthlyPointsMap.set(monthDate, true)
      monthly.push({
        timestamp: monthDate,
        ...pointData,
      })
    }
  })

  const dataPoints = {
    daily,
    weekly,
    monthly,
  }

  const parsedData = {
    generatedAt: forecastData.metadata.forecast_generated_at,
    dataPoints,
  } as ForecastData

  // Store the result in the cache
  // There is no race condition here, as the cache is a simple in-memory object
  // eslint-disable-next-line require-atomic-updates
  cache[cacheKey] = {
    data: parsedData,
    timestamp: Date.now(),
  }

  return NextResponse.json(parsedData)
}
