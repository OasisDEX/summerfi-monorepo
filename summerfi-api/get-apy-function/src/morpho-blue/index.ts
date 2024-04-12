// Get market data and interest rates from Morpho Blue subgraph.
// Split the data in some parts to calculate the apy for 7 days, 30 days, 90 days and 1 year.

import { LTV } from '@summerfi/serverless-shared'
import {
  MorphoBlueMarketInterestRateResult,
  MorphoBlueSubgraphClient,
} from '@summerfi/morpho-blue-subgraph/dist'
import { Logger } from '@aws-lambda-powertools/logger'

const ONE_YEAR_TIMESTAMP = 365 * 24 * 60 * 60

function calculateBorrowForTimestamp(
  morphoSubgraphResponse: MorphoBlueMarketInterestRateResult,
  timestamp: number,
  days: number,
) {
  const apy = morphoSubgraphResponse.interestRates.borrow
    .filter((rate) => rate.toTimestamp >= BigInt(timestamp))
    .map((rate) => {
      if (rate.fromTimestamp < timestamp) {
        return {
          ...rate,
          fromTimestamp: timestamp,
          duration: rate.toTimestamp - timestamp,
        }
      }
      return rate
    })
    .map((rate) => {
      // (1 + r)^(duration / (60 * 60 * 24 * 365))
      return Math.pow(1 + rate.rate, rate.duration / (60 * 60 * 24 * 365))
    })
    .reduce((acc, rate) => acc * rate, 1)

  return Math.pow(apy, 365 / days) - 1
}

export const getMorphoBlueApy = async (params: {
  marketId: `0x${string}`
  ltv: LTV
  timestamp: number
  logger: Logger
  subgraphClient: MorphoBlueSubgraphClient
}) => {
  const earliestTimestamp = params.timestamp - ONE_YEAR_TIMESTAMP

  const morphoSubgraphResponse = await params.subgraphClient.getInterestRate({
    marketId: params.marketId,
    fromTimestamp: earliestTimestamp,
    toTimestamp: params.timestamp,
  })

  const timestamp1dayAgo = params.timestamp - 1 * 24 * 60 * 60
  const timestamp7daysAgo = params.timestamp - 7 * 24 * 60 * 60

  const timestamp30daysAgo = params.timestamp - 30 * 24 * 60 * 60

  const timestamp90daysAgo = params.timestamp - 90 * 24 * 60 * 60

  const timestamp1yearAgo = params.timestamp - 365 * 24 * 60 * 60

  const timestamps = [
    [timestamp1dayAgo, 1],
    [timestamp7daysAgo, 7],
    [timestamp30daysAgo, 30],
    [timestamp90daysAgo, 90],
    [timestamp1yearAgo, 365],
  ]

  const [borrowRate1d, borrowRate7d, borrowRate30d, borrowRate90d, borrowRate] = timestamps.map(
    ([timestamp, days]) => {
      return calculateBorrowForTimestamp(morphoSubgraphResponse, timestamp, days)
    },
  )

  return {
    borrowRate1d,
    borrowRate7d,
    borrowRate30d,
    borrowRate90d,
    borrowRate,
    market: morphoSubgraphResponse.marketId,
  }
}
