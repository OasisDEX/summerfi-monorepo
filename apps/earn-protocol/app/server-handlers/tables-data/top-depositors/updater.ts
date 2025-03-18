import { subgraphNetworkToId } from '@summerfi/app-utils'
import { type SummerProtocolDB } from '@summerfi/summer-protocol-db'
import { BigNumber } from 'bignumber.js'
import { type GraphQLClient } from 'graphql-request'

import { getVaultsApy } from '@/app/server-handlers/vaults-apy'

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
  const topDepositors = await getTopDepositors({
    mainnetGraphQlClient,
    baseGraphQlClient,
    arbitrumGraphQlClient,
  })

  const uniqueFleets = Array.from(
    new Set(
      topDepositors.map(
        (position) =>
          `${position.vault.id}-${subgraphNetworkToId(position.vault.protocol.network)}`,
      ),
    ),
  ).map((key) => {
    const [fleetAddress, chainId] = key.split('-')

    return {
      fleetAddress,
      chainId: Number(chainId),
    }
  })

  const vaultsApyData = await getVaultsApy({
    fleets: uniqueFleets,
  })
  const extendPositions = topDepositors.map((position) => {
    const changeSevenDays = calculateTopDepositors7daysChange({ position }).toString()

    const earningsStreakResetTimestamp = getEarningStreakResetTimestamp({ position })

    const earningsStreak = BigInt(new Date().getTime() - earningsStreakResetTimestamp)

    const projectedOneYearEarnings = new BigNumber(
      vaultsApyData[
        `${position.vault.id}-${subgraphNetworkToId(position.vault.protocol.network)}`
      ].apy,
    ).times(position.inputTokenBalanceNormalized)

    const projectedOneYearEarningsUsd = projectedOneYearEarnings.times(
      position.vault.inputTokenPriceUSD,
    )

    return {
      ...position,
      changeSevenDays,
      earningsStreak,
      projectedOneYearEarnings: projectedOneYearEarnings.toString(),
      projectedOneYearEarningsUsd: projectedOneYearEarningsUsd.toString(),
    }
  })

  // Insert top depositors in batches to avoid parameter limit
  await insertTopDepositorsInBatches(db, extendPositions)
}
