import { type FleetRate } from '@summerfi/app-types'
import { mapChainIdToDbNetwork, subgraphNetworkToSDKId } from '@summerfi/app-utils'
import { type SummerProtocolDB } from '@summerfi/summer-protocol-db'
import { BigNumber } from 'bignumber.js'
import { type GraphQLClient } from 'graphql-request'

import { getTopDepositors } from './getter'
import { calculateTopDepositors7daysChange, getEarningStreakResetTimestamp } from './helpers'
import { insertTopDepositorsInBatches } from './inserter'

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
    if (!acc[`${rate.fleetAddress}-${rate.network}`]) {
      acc[`${rate.fleetAddress}-${rate.network}`] = []
    }
    acc[`${rate.fleetAddress}-${rate.network}`].push({
      id: rate.id,
      rate: rate.rate.toString(),
      timestamp: Number(rate.timestamp),
      fleetAddress: rate.fleetAddress,
    })

    return acc
  }, {})

  const latestRatesByFleet = Object.entries(ratesByFleet).reduce<{
    [key: string]: FleetRate
  }>(
    (acc, [fleetId, _rates]) => ({
      ...acc,
      [fleetId]: _rates[0], // Take first item since array is already sorted by timestamp desc
    }),
    {},
  )

  const extendPositions = topDepositors.map((position) => {
    const changeSevenDays = calculateTopDepositors7daysChange({ position }).toString()

    const earningsStreakResetTimestamp = getEarningStreakResetTimestamp({ position })

    const fleetId = `${position.vault.id}-${mapChainIdToDbNetwork(subgraphNetworkToSDKId(position.vault.protocol.network))}`

    const earningsStreak = BigInt(new Date().getTime() - earningsStreakResetTimestamp)

    const projectedOneYearEarnings = new BigNumber(latestRatesByFleet[fleetId].rate)
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
