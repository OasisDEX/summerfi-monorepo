'use server'

import { REVALIDATION_TAGS } from '@summerfi/app-earn-ui'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateUser = (walletAddress?: string) => {
  // clears the cache and revalidates all data with the users wallet tag
  if (walletAddress) {
    revalidateTag(walletAddress.toLowerCase())
  }
}

export const revalidateVaultsListData = () => {
  // clears the cache and revalidates the vaults list data
  revalidatePath('/earn')
  revalidateTag(REVALIDATION_TAGS.INTEREST_RATES)
}

export const revalidatePositionData = (
  chainName?: string,
  vaultId?: string,
  walletAddress?: string,
) => {
  // clears the cache and revalidates the position data (either user position or vault page)
  if (chainName && vaultId) {
    revalidatePath(
      `/earn/${chainName}/position/${vaultId}${walletAddress ? `/${walletAddress}` : ''}`,
    )
  }
}
