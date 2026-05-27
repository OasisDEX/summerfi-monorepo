'use client'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { CACHE_TAGS } from '@/constants/revalidation'
import { getUserDataCacheHandler } from '@/helpers/get-cache-handler-name'

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
      tags: [CACHE_TAGS.VAULTS_LIST, CACHE_TAGS.INTEREST_RATES].filter(Boolean),
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
      walletAddress ? getUserDataCacheHandler(walletAddress) : undefined,
    ].filter(Boolean)

    queryClient.refetchQueries({
      queryKey: tags,
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
