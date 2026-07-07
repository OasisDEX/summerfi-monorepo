'use server'

import { type SDKVaultishType, type SDKVaultType, SupportedSDKNetworks } from '@summerfi/app-types'
import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import { GraphQLClient } from 'graphql-request'

import { subgraphsMap } from '@/app/server-handlers/subgraphs-map'
import { CACHE_TIMES } from '@/constants/revalidation'
import {
  GetPositionHistoryDocument,
  type GetPositionHistoryQuery,
} from '@/graphql/clients/position-history/client'

type GetPositionHistoryParams = {
  network: SupportedSDKNetworks
  address: string
  vault: SDKVaultishType | SDKVaultType
}

type GetPositionHistoryResult = {
  positionHistory: GetPositionHistoryQuery
  vault: SDKVaultishType | SDKVaultType
  noOfDeposits: number
}

const _positionHistoryCache = new Map<
  string,
  { data: GetPositionHistoryResult; expiresAt: number }
>()

const networkDbNameMap = {
  [SupportedSDKNetworks.Mainnet]: 'mainnet' as const,
  [SupportedSDKNetworks.Base]: 'base' as const,
  [SupportedSDKNetworks.ArbitrumOne]: 'arbitrum' as const,
  [SupportedSDKNetworks.SonicMainnet]: 'sonic' as const,
  [SupportedSDKNetworks.Hyperliquid]: 'hyperliquid' as const,
}

export async function getCachedPositionHistory({
  network,
  address,
  vault,
}: GetPositionHistoryParams) {
  const cacheKey = `${network}:${address}:${vault.id}`
  const now = Date.now()
  const cached = _positionHistoryCache.get(cacheKey)

  if (cached && cached.expiresAt > now) {
    return cached.data
  }

  const positionId = `${address}-${vault.id}`

  let dbInstance: Awaited<ReturnType<typeof getSummerProtocolDB>> | undefined
  const connectionString = process.env.EARN_PROTOCOL_DB_CONNECTION_STRING

  if (!connectionString) {
    throw new Error('Summer Protocol DB Connection string is not set')
  }

  try {
    dbInstance = await getSummerProtocolDB({
      connectionString,
    })
  } catch (error) {
    throw new Error('Failed to connect to Summer Protocol DB')
  }

  try {
    const isProperNetwork = (net: string): net is keyof typeof subgraphsMap => net in subgraphsMap

    if (!isProperNetwork(network)) {
      throw new Error(`getCachedPositionHistory: No endpoint found for network: ${network}`)
    }

    const networkGraphQlClient = new GraphQLClient(subgraphsMap[network])

    const [positionHistory, noOfDepositsQueryResult] = await Promise.all([
      networkGraphQlClient.request<GetPositionHistoryQuery>(
        GetPositionHistoryDocument,
        {
          positionId,
        },
        {
          origin: 'earn-protocol-app',
        },
      ),
      dbInstance.db
        .selectFrom('latestActivity')
        .where('userAddress', '=', address.toLowerCase())
        .where('vaultId', '=', vault.id)
        .where('network', '=', networkDbNameMap[network])
        .where('actionType', '=', 'deposit')
        .select((eb) => eb.fn.count('id').as('noOfDeposits'))
        .executeTakeFirst(),
    ])

    const result: GetPositionHistoryResult = {
      positionHistory,
      vault,
      noOfDeposits: Number(noOfDepositsQueryResult?.noOfDeposits ?? 0),
    }

    _positionHistoryCache.set(cacheKey, {
      data: result,
      expiresAt: now + Number(CACHE_TIMES.POSITION_HISTORY * 1000),
    })

    return result
  } finally {
    await dbInstance.db.destroy()
  }
}

export type GetPositionHistoryReturnType = GetPositionHistoryResult
