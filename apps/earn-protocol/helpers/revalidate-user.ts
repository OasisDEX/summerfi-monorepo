'use server'

import { revalidateTag } from 'next/cache'

export const revalidateUser = (walletAddress?: string) => {
  // clears the cache and revalidates all data with the users wallet tag
  if (walletAddress) {
    revalidateTag(walletAddress.toLowerCase())
  }
}
