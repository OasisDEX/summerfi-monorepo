'use server'

import { revalidatePath } from 'next/cache'

export const revalidateActivityData = async (
  institutionName: string,
  vaultAddress: string,
  networkName: string,
) => {
  if (vaultAddress && networkName) {
    return await Promise.resolve(
      revalidatePath(`/${institutionName}/vaults/${networkName}/${vaultAddress}/activity`),
    )
  }

  return await Promise.resolve()
}
