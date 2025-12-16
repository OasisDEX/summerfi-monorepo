'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

import { CACHE_TAGS } from '@/constants/revalidation'
import { getUserDataCacheHandler } from '@/helpers/get-user-data-cache-handler'

const revalidationDebugging = true

export const serverRevalidateUser = async (walletAddress?: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (revalidationDebugging) {
    // eslint-disable-next-line no-console
    console.log('Revalidating user data for:', walletAddress)
  }
  if (walletAddress) {
    return await Promise.resolve(revalidateTag(getUserDataCacheHandler(walletAddress)))
  }

  return await Promise.resolve()
}

export const serverRevalidateVaultsListData = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (revalidationDebugging) {
    // eslint-disable-next-line no-console
    console.log('Revalidating vaults list data')
  }
  // clears the cache and revalidates the vaults list data
  revalidateTag(CACHE_TAGS.VAULTS_LIST)
  revalidateTag(CACHE_TAGS.INTEREST_RATES)

  return await Promise.resolve()
}

export const serverRevalidatePositionData = async (
  chainName?: string,
  vaultId?: string,
  walletAddress?: string,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (revalidationDebugging) {
    // eslint-disable-next-line no-console
    console.log('Revalidating position data for:', { chainName, vaultId, walletAddress })
  }
  revalidateTag(CACHE_TAGS.VAULTS_LIST)
  revalidateTag(CACHE_TAGS.INTEREST_RATES)
  serverRevalidateUser(walletAddress)
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

export const serverRevalidateMigrationData = async (walletAddress?: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (revalidationDebugging) {
    // eslint-disable-next-line no-console
    console.log('Revalidating migration data for:', walletAddress)
  }
  // clears the cache and revalidates the migration data
  revalidateTag(CACHE_TAGS.MIGRATION_DATA)

  if (walletAddress) {
    return await Promise.resolve(revalidateTag(walletAddress.toLowerCase()))
  }

  return await Promise.resolve(null)
}
