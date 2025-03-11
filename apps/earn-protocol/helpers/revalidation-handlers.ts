'use server'

import { REVALIDATION_TAGS } from '@summerfi/app-earn-ui'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateUser = async (walletAddress?: string) => {
  // clears the cache and revalidates all data with the users wallet tag
  revalidateTag(REVALIDATION_TAGS.INTEREST_RATES)
  revalidateTag(REVALIDATION_TAGS.VAULTS_LIST)
  revalidateTag(REVALIDATION_TAGS.PORTFOLIO_DATA)
  if (walletAddress) {
    return await Promise.resolve(revalidateTag(walletAddress.toLowerCase()))
  }

  return await Promise.resolve(null)
}

export const revalidateVaultsListData = async () => {
  // clears the cache and revalidates the vaults list data
  revalidateTag(REVALIDATION_TAGS.VAULTS_LIST)
  revalidateTag(REVALIDATION_TAGS.INTEREST_RATES)

  return await Promise.resolve()
}

export const revalidatePositionData = async (
  chainName?: string,
  vaultId?: string,
  walletAddress?: string,
) => {
  revalidateTag(REVALIDATION_TAGS.VAULTS_LIST)
  revalidateTag(REVALIDATION_TAGS.INTEREST_RATES)
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
  revalidateTag(REVALIDATION_TAGS.MIGRATION_DATA)

  if (walletAddress) {
    return await Promise.resolve(revalidateTag(walletAddress.toLowerCase()))
  }

  return await Promise.resolve(null)
}
