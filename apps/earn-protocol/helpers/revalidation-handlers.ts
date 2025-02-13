'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateUser = async (walletAddress?: string) => {
  // clears the cache and revalidates all data with the users wallet tag
  if (walletAddress) {
    return await Promise.resolve(revalidateTag(walletAddress.toLowerCase()))
  }

  return await Promise.resolve(null)
}

export const revalidateVaultsListData = async () => {
  // clears the cache and revalidates the vaults list data
  return await Promise.resolve(revalidatePath('/earn'))
}

export const revalidatePositionData = async (
  chainName?: string,
  vaultId?: string,
  walletAddress?: string,
) => {
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
