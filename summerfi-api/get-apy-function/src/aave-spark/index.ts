import { Address, LTV, ProtocolId } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { AaveSparkInterestRateResult, AaveSparkSubgraphClient } from '@summerfi/aave-spark-subgraph'

const ONE_YEAR_TIMESTAMP = 365 * 24 * 60 * 60

function calculateBorrowForTimestamp(
  aaveSparkSubgraphResponse: AaveSparkInterestRateResult,
  timestamp: number,
  days: number,
) {
  const apy = aaveSparkSubgraphResponse.interestRates.borrow
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

export const getAaveSparkBorrowRates = async (params: {
  token: Address
  ltv: LTV
  protocol: ProtocolId.SPARK | ProtocolId.AAVE_V3 | ProtocolId.AAVE_V2
  timestamp: number
  logger: Logger
  subgraphClient: AaveSparkSubgraphClient
}) => {
  const earliestTimestamp = params.timestamp - ONE_YEAR_TIMESTAMP

  const aaveSubgraphResponse = await params.subgraphClient.getInterestRate({
    token: params.token,
    protocol: params.protocol,
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
      return calculateBorrowForTimestamp(aaveSubgraphResponse, timestamp, days)
    },
  )

  return {
    borrowRate1d,
    borrowRate7d,
    borrowRate30d,
    borrowRate90d,
    borrowRate,
    token: aaveSubgraphResponse.token,
  }
}
