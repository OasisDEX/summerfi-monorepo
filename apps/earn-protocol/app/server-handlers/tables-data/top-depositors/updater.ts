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
    const change7d = calculateTopDepositors7daysChange({ position }).toString()

    const earningStreakResetTimestamp = getEarningStreakResetTimestamp({ position })

    const earningStreak = BigInt(new Date().getTime() - earningStreakResetTimestamp)

    const projected1yEarnings = new BigNumber(
      vaultsApyData[
        `${position.vault.id}-${subgraphNetworkToId(position.vault.protocol.network)}`
      ].apy,
    ).times(position.inputTokenBalanceNormalized)

    const projected1yEarningsInUSD = projected1yEarnings.times(position.vault.inputTokenPriceUSD)

    return {
      ...position,
      change7d,
      earningStreak,
      projected1yEarnings: projected1yEarnings.toString(),
      projected1yEarningsInUSD: projected1yEarningsInUSD.toString(),
    }
  })

  // Insert top depositors in batches to avoid parameter limit
  await insertTopDepositorsInBatches(db, extendPositions)
}
