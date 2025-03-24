import { type FleetRate } from '@summerfi/app-types'
import { mapChainIdToDbNetwork, subgraphNetworkToSDKId } from '@summerfi/app-utils'
import { type SummerProtocolDB } from '@summerfi/summer-protocol-db'
import { BigNumber } from 'bignumber.js'
import { type GraphQLClient } from 'graphql-request'

import { getTopDepositors } from './getter'
import { calculateTopDepositors7daysChange, getEarningStreakResetTimestamp } from './helpers'
import { insertTopDepositorsInBatches } from './inserter'

/**
 * Updates the top depositors by fetching the latest data, calculating derived metrics,
 * and inserting it into the database.
 *
 * @param db - The database instance for performing insert operations.
 * @param mainnetGraphQlClient - The GraphQL client instance for the mainnet.
 * @param baseGraphQlClient - The GraphQL client instance for the base network.
 * @param arbitrumGraphQlClient - The GraphQL client instance for the arbitrum network.
 *
 * @returns An object containing the number of updated rows and the operation duration in seconds.
 */
export const updateTopDepositors = async ({
  db,
  mainnetGraphQlClient,
  baseGraphQlClient,
  arbitrumGraphQlClient,
}: {
  db: SummerProtocolDB['db']
  mainnetGraphQlClient: GraphQLClient
  baseGraphQlClient: GraphQLClient
  arbitrumGraphQlClient: GraphQLClient
}) => {
  const startTime = Date.now()
  const topDepositors = await getTopDepositors({
    mainnetGraphQlClient,
    baseGraphQlClient,
    arbitrumGraphQlClient,
  })

  const rates = await db
    .selectFrom('fleetInterestRate')
    .selectAll()
    .orderBy('timestamp', 'desc')
    .execute()

  const ratesByFleet = rates.reduce<{ [key: string]: FleetRate[] }>((acc, rate) => {
    const fleetId = `${rate.fleetAddress}-${rate.network}`

    if (!acc[fleetId]) {
      acc[fleetId] = []
    }

    acc[fleetId].push({
      id: rate.id,
      rate: rate.rate.toString(),
      timestamp: Number(rate.timestamp),
      fleetAddress: rate.fleetAddress,
    })

    return acc
  }, {})

  const latestRatesByFleet = Object.entries(ratesByFleet).reduce<{
    [key: string]: FleetRate
  }>((acc, [fleetId, _rates]) => {
    // eslint-disable-next-line prefer-destructuring
    acc[fleetId] = _rates[0] // Take first item since array is already sorted by timestamp desc

    return acc
  }, {})

  const extendPositions = topDepositors.map((position) => {
    const changeSevenDays = calculateTopDepositors7daysChange({ position }).toString()

    const earningsStreakResetTimestamp = getEarningStreakResetTimestamp({ position })

    const fleetId = `${position.vault.id}-${mapChainIdToDbNetwork(subgraphNetworkToSDKId(position.vault.protocol.network))}`

    const earningsStreak = BigInt(new Date().getTime() - earningsStreakResetTimestamp)

    const fleetRate = latestRatesByFleet[fleetId]

    if (!fleetRate) {
      throw new Error(`No fleet rate found for fleetId: ${fleetId}`)
    }

    const projectedOneYearEarnings = new BigNumber(fleetRate.rate)
      .div(100)
      .times(position.inputTokenBalanceNormalized)

    const projectedOneYearEarningsUsd = projectedOneYearEarnings.times(
      position.vault.inputTokenPriceUSD ?? 0,
    )

    return {
      ...position,
      changeSevenDays,
      earningsStreak,
      projectedOneYearEarnings: projectedOneYearEarnings.toString(),
      projectedOneYearEarningsUsd: projectedOneYearEarningsUsd.toString(),
    }
  })

  const { updated } = await insertTopDepositorsInBatches(db, extendPositions)

  const endTime = Date.now()
  const duration = `${((endTime - startTime) / 1000).toFixed(2)}s`

  return {
    updated,
    duration,
  }
}
