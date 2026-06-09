'use server'

import {
  type SDKVaultishType,
  type SDKVaultType,
  type SupportedSDKNetworks,
} from '@summerfi/app-types'
import { gql, GraphQLClient } from 'graphql-request'

import { rwaSubgraphsMap, subgraphsMap } from '@/app/server-handlers/subgraphs-map'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'
import { type VaultCurationEvent } from '@/features/curation-activity/types'
import { getVaultDetailsTag } from '@/helpers/get-cache-handler-name'

type GetVaultCurationEventsParams = {
  network: SupportedSDKNetworks
  vault: SDKVaultishType | SDKVaultType
  timestampFrom: number
  isRwaVault?: boolean
}

type GetVaultCurationEventsQuery = {
  curationEvents: VaultCurationEvent[]
}

const GetVaultCurationEventsDocument = gql`
  query GetVaultCurationEvents($timestampFrom: BigInt!, $targetContractsList: [String!]) {
    curationEvents(
      orderBy: timestamp
      orderDirection: desc
      first: 4
      where: { timestamp_gt: $timestampFrom, targetContract_in: $targetContractsList }
    ) {
      action
      valueBefore
      valueAfter
      caller
      timestamp
      targetContract
      hash
    }
  }
`

export async function getCachedVaultCurationEvents({
  network,
  vault,
  timestampFrom,
  isRwaVault = false,
}: GetVaultCurationEventsParams) {
  const targetContractsList = [vault.id, ...vault.arks.map((ark) => ark.id)]

  const customFetchCache = async (url: RequestInfo | URL, params?: RequestInit) =>
    await fetch(url, {
      ...params,
      next: {
        revalidate: CACHE_TIMES.VAULTS_LIST,
        tags: [getVaultDetailsTag(vault.id, `${network}`), CACHE_TAGS.VAULTS_LIST],
      },
    })

  const isProperNetwork = (net: string): net is keyof typeof subgraphsMap => net in subgraphsMap

  const isProperRwaNetwork = (net: string): net is keyof typeof rwaSubgraphsMap =>
    net in rwaSubgraphsMap

  if (isRwaVault ? !isProperRwaNetwork(network) : !isProperNetwork(network)) {
    throw new Error(`getCachedVaultCurationEvents: No endpoint found for network: ${network}`)
  }

  const networkGraphQlClient = new GraphQLClient(
    isRwaVault && isProperRwaNetwork(network) ? rwaSubgraphsMap[network] : subgraphsMap[network],
    {
      fetch: customFetchCache,
    },
  )

  const response = await networkGraphQlClient.request<GetVaultCurationEventsQuery>(
    GetVaultCurationEventsDocument,
    {
      timestampFrom,
      targetContractsList,
    },
    {
      origin: 'earn-protocol-app',
    },
  )

  return response.curationEvents
}

export type GetVaultCurationEventsReturnType = Awaited<
  ReturnType<typeof getCachedVaultCurationEvents>
>
