'use server'

import { type SDKVaultishType, type SDKVaultType, SupportedSDKNetworks } from '@summerfi/app-types'
import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import { GraphQLClient } from 'graphql-request'

import { subgraphsMap } from '@/app/server-handlers/subgraphs-map'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'
import {
  GetPositionHistoryDocument,
  type GetPositionHistoryQuery,
} from '@/graphql/clients/position-history/client'
import { getPositionHistoryTag } from '@/helpers/get-cache-handler-name'

type GetPositionHistoryParams = {
  network: SupportedSDKNetworks
  address: string
  vault: SDKVaultishType | SDKVaultType
}

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
    // passing next.js fetcher with cache duration
    const customFetchCache = async (url: RequestInfo | URL, params?: RequestInit) =>
      await fetch(url, {
        ...params,
        next: {
          revalidate: CACHE_TIMES.POSITION_HISTORY,
          tags: [CACHE_TAGS.POSITION_HISTORY, getPositionHistoryTag(address)],
        },
      })

    const isProperNetwork = (net: string): net is keyof typeof subgraphsMap => net in subgraphsMap

    if (!isProperNetwork(network)) {
      throw new Error(`getCachedPositionHistory: No endpoint found for network: ${network}`)
    }

    const networkGraphQlClient = new GraphQLClient(subgraphsMap[network], {
      fetch: customFetchCache,
    })

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

    return {
      positionHistory,
      vault,
      noOfDeposits: Number(noOfDepositsQueryResult?.noOfDeposits ?? 0),
    }
  } finally {
    await dbInstance.db.destroy()
  }
}

export type GetPositionHistoryReturnType = Awaited<ReturnType<typeof getCachedPositionHistory>>
