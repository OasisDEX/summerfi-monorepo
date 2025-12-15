import { CACHE_TAGS } from '@/constants/revalidation'

export const getUserDataCacheHandler = (walletAddress: string) => {
  return `${CACHE_TAGS.USER_DATA}-${walletAddress.toLowerCase()}`
}
