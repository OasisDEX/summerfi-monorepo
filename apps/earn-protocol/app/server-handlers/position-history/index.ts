'use server'

import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { type SDKVaultishType, type SDKVaultType, SupportedSDKNetworks } from '@summerfi/app-types'
import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import { GraphQLClient } from 'graphql-request'

import {
  GetPositionHistoryDocument,
  type GetPositionHistoryQuery,
} from '@/graphql/clients/position-history/client'

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
}

const subgraphsMap = {
  [SupportedSDKNetworks.Mainnet]: `${process.env.SUBGRAPH_BASE}/summer-protocol`,
  [SupportedSDKNetworks.Base]: `${process.env.SUBGRAPH_BASE}/summer-protocol-base`,
  [SupportedSDKNetworks.ArbitrumOne]: `${process.env.SUBGRAPH_BASE}/summer-protocol-arbitrum`,
  [SupportedSDKNetworks.SonicMainnet]: `${process.env.SUBGRAPH_BASE}/summer-protocol-sonic`,
}

export async function getPositionHistory({ network, address, vault }: GetPositionHistoryParams) {
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

  // passing next.js fetcher with cache duration
  const customFetchCache = async (url: RequestInfo | URL, params?: RequestInit) =>
    await fetch(url, {
      ...params,
      next: {
        revalidate: REVALIDATION_TIMES.POSITION_HISTORY,
        tags: [REVALIDATION_TAGS.POSITION_HISTORY, address.toLowerCase()],
      },
    })

  const isProperNetwork = (net: string): net is keyof typeof subgraphsMap => net in subgraphsMap

  if (!isProperNetwork(network)) {
    throw new Error(`getPositionHistory: No endpoint found for network: ${network}`)
  }

  const networkGraphQlClient = new GraphQLClient(subgraphsMap[network], {
    fetch: customFetchCache,
  })

  const [positionHistory, noOfDepositsQueryResult] = await Promise.all([
    networkGraphQlClient.request<GetPositionHistoryQuery>(GetPositionHistoryDocument, {
      positionId,
    }),
    dbInstance.db
      .selectFrom('latestActivity')
      .selectAll()
      .where('userAddress', '=', address.toLowerCase())
      .where('vaultId', '=', vault.id)
      .where('network', '=', networkDbNameMap[network])
      .where('actionType', '=', 'deposit')
      .select((eb) => eb.fn.count('id').as('noOfDeposits'))
      .executeTakeFirst(),
  ])

  await dbInstance.db.destroy()

  return {
    positionHistory,
    vault,
    noOfDeposits: Number(noOfDepositsQueryResult?.noOfDeposits ?? 0),
  }
}

export type GetPositionHistoryReturnType = Awaited<ReturnType<typeof getPositionHistory>>
