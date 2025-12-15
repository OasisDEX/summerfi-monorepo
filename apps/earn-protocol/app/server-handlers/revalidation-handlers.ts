'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

import { CACHE_TAGS } from '@/constants/revalidation'
import { getUserDataCacheHandler } from '@/helpers/get-user-data-cache-handler'

export const revalidateUser = async (walletAddress?: string) => {
  if (walletAddress) {
    return await Promise.resolve(revalidateTag(getUserDataCacheHandler(walletAddress)))
  }

  return await Promise.resolve(null)
}

export const revalidateVaultsListData = async () => {
  // clears the cache and revalidates the vaults list data
  revalidateTag(CACHE_TAGS.VAULTS_LIST)
  revalidateTag(CACHE_TAGS.INTEREST_RATES)

  return await Promise.resolve()
}

export const revalidatePositionData = async (
  chainName?: string,
  vaultId?: string,
  walletAddress?: string,
) => {
  revalidateTag(CACHE_TAGS.VAULTS_LIST)
  revalidateTag(CACHE_TAGS.INTEREST_RATES)
  revalidateUser(walletAddress)
  // clears the cache and revalidates the position data (either user position or vault page)
  if (chainName && vaultId) {
    return await Promise.resolve(
      revalidatePath(
        `/earn/${chainName}/position/${vaultId}${walletAddress ? `/${walletAddress}` : ''}`,
      ),
    )
  }

  return await Promise.resolve(null)
}

export const revalidateMigrationData = async (walletAddress?: string) => {
  // clears the cache and revalidates the migration data
  revalidateTag(CACHE_TAGS.MIGRATION_DATA)

  if (walletAddress) {
    return await Promise.resolve(revalidateTag(walletAddress.toLowerCase()))
  }

  return await Promise.resolve(null)
}
