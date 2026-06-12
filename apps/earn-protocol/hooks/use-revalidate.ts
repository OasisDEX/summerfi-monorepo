'use client'
import { humanNetworktoSDKNetwork, subgraphNetworkToId } from '@summerfi/app-utils'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { CACHE_TAGS } from '@/constants/revalidation'
import { getFleetFeesTag, getUserDataCacheHandler } from '@/helpers/get-cache-handler-name'

const fetchRevalidate = async ({
  tags,
  paths,
}: {
  tags?: (string | undefined)[]
  paths?: (string | undefined)[]
}) => {
  await fetch('/earn/api/revalidate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tags, paths }),
  })
}

export const useRevalidateTags = () => {
  const { refresh: refreshView } = useRouter()
  const queryClient = useQueryClient()

  const revalidateTags = ({ tags }: { tags: string[] }) => {
    queryClient.refetchQueries({
      queryKey: tags.filter(Boolean),
      type: 'all',
    })
    fetchRevalidate({ tags: tags.filter(Boolean) }).then(() => {
      refreshView()
    })
  }

  return {
    revalidateTags,
  }
}

export const useRevalidateUser = () => {
  const { refresh: refreshView } = useRouter()
  const queryClient = useQueryClient()

  return (walletAddress?: string) => {
    if (!walletAddress) return

    queryClient.refetchQueries({
      queryKey: [getUserDataCacheHandler(walletAddress)].filter(Boolean),
      type: 'all',
    })

    fetchRevalidate({
      tags: [getUserDataCacheHandler(walletAddress)].filter(Boolean),
    }).then(() => {
      refreshView()
    })
  }
}

export const useRevalidateVaultsListData = () => {
  const { refresh: refreshView } = useRouter()
  const queryClient = useQueryClient()

  return () => {
    // The vaults-list query key is [VAULTS_LIST, filter, wallet] and the additional-data
    // query key is [VAULTS_LIST, 'additional-data']; match on the leading tag so a refresh
    // actually refetches them (a [VAULTS_LIST, INTEREST_RATES] prefix never would).
    queryClient.refetchQueries({
      predicate: (query) =>
        query.queryKey[0] === CACHE_TAGS.VAULTS_LIST ||
        query.queryKey[0] === CACHE_TAGS.INTEREST_RATES,
      type: 'all',
    })

    fetchRevalidate({
      // FLEET_FEES busts every vault's cached on-chain management/performance fee in one go.
      tags: [CACHE_TAGS.VAULTS_LIST, CACHE_TAGS.INTEREST_RATES, CACHE_TAGS.FLEET_FEES].filter(
        Boolean,
      ),
    }).then(() => {
      refreshView()
    })
  }
}

export const useRevalidatePositionData = () => {
  const { refresh: refreshView } = useRouter()
  const queryClient = useQueryClient()

  return ({
    chainName,
    vaultId,
    walletAddress,
    vaultToken,
  }: {
    chainName?: string
    vaultId?: string
    walletAddress?: string
    vaultToken?: string
  }) => {
    const vaultPerformanceAsset = vaultToken
      ? ['ETH', 'WETH'].includes(vaultToken.toUpperCase())
        ? 'ETH'
        : 'USD'
      : undefined
    const tags = [
      CACHE_TAGS.VAULTS_LIST,
      CACHE_TAGS.INTEREST_RATES,
      chainName && vaultPerformanceAsset
        ? `${CACHE_TAGS.VAULT_PERFORMANCE}-${chainName.toLowerCase()}-${vaultPerformanceAsset.toLowerCase()}`
        : undefined,
      // Surgically bust just this vault's cached on-chain fees so the refreshed page re-reads them.
      chainName && vaultId
        ? getFleetFeesTag(vaultId, subgraphNetworkToId(humanNetworktoSDKNetwork(chainName)))
        : undefined,
      walletAddress ? getUserDataCacheHandler(walletAddress) : undefined,
    ].filter(Boolean)

    // The vault-open/manage query keys are [VAULTS_LIST, '<unit>', network, vaultId, ...], so a
    // `queryKey: tags` prefix match (tags[1] is INTEREST_RATES) would never hit them. Match on the
    // leading tag instead so the reload button actually refetches the hydrated page data client
    // side (mirrors useRevalidateVaultsListData), alongside any user-scoped queries.
    const userDataTag = walletAddress ? getUserDataCacheHandler(walletAddress) : undefined

    queryClient.refetchQueries({
      predicate: (query) => {
        const [leadingTag] = query.queryKey

        return (
          leadingTag === CACHE_TAGS.VAULTS_LIST ||
          leadingTag === CACHE_TAGS.INTEREST_RATES ||
          (!!userDataTag && leadingTag === userDataTag)
        )
      },
      type: 'all',
    })
    fetchRevalidate({
      tags,
      paths: (chainName && vaultId
        ? [`/earn/${chainName}/position/${vaultId}${walletAddress ? `/${walletAddress}` : ''}`]
        : []
      ).filter(Boolean),
    }).then(() => {
      refreshView()
    })
  }
}

export const useRevalidateMigrationData = () => {
  const { refresh: refreshView } = useRouter()
  const queryClient = useQueryClient()

  return ({ walletAddress }: { walletAddress?: string }) => {
    queryClient.refetchQueries({
      queryKey: [
        CACHE_TAGS.MIGRATION_DATA,
        walletAddress ? getUserDataCacheHandler(walletAddress) : undefined,
      ].filter(Boolean),
      type: 'all',
    })

    fetchRevalidate({
      tags: [
        CACHE_TAGS.MIGRATION_DATA,
        walletAddress ? getUserDataCacheHandler(walletAddress) : undefined,
      ].filter(Boolean),
    }).then(() => {
      refreshView()
    })
  }
}
