'use client'
import { useRouter } from 'next/navigation'

import { CACHE_TAGS } from '@/constants/revalidation'
import { getUserDataCacheHandler } from '@/helpers/get-user-data-cache-handler'

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

  const revalidateTags = ({ tags }: { tags: string[] }) => {
    fetchRevalidate({ tags }).then(() => {
      refreshView()
    })
  }

  return {
    revalidateTags,
  }
}

export const useRevalidateUser = () => {
  const { refresh: refreshView } = useRouter()

  return (walletAddress?: string) => {
    if (!walletAddress) return

    fetchRevalidate({
      tags: [getUserDataCacheHandler(walletAddress)],
    }).then(() => {
      refreshView()
    })
  }
}

export const useRevalidateVaultsListData = () => {
  const { refresh: refreshView } = useRouter()

  return () => {
    fetchRevalidate({
      tags: [CACHE_TAGS.VAULTS_LIST, CACHE_TAGS.INTEREST_RATES],
    }).then(() => {
      refreshView()
    })
  }
}

export const useRevalidatePositionData = () => {
  const { refresh: refreshView } = useRouter()

  return ({
    chainName,
    vaultId,
    walletAddress,
  }: {
    chainName?: string
    vaultId?: string
    walletAddress?: string
  }) => {
    fetchRevalidate({
      tags: [
        CACHE_TAGS.VAULTS_LIST,
        CACHE_TAGS.INTEREST_RATES,
        walletAddress ? getUserDataCacheHandler(walletAddress) : undefined,
      ],
      paths:
        chainName && vaultId
          ? [`/earn/${chainName}/position/${vaultId}${walletAddress ? `/${walletAddress}` : ''}`]
          : [],
    }).then(() => {
      refreshView()
    })
  }
}

export const useRevalidateMigrationData = () => {
  const { refresh: refreshView } = useRouter()

  return () => {
    fetchRevalidate({
      tags: [CACHE_TAGS.MIGRATION_DATA],
    }).then(() => {
      refreshView()
    })
  }
}
