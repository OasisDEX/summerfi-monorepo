import { REVALIDATION_TAGS } from '@summerfi/app-earn-ui'
import { unstable_cache as unstableCache } from 'next/cache'

import { getUserBeachClubData } from '@/app/server-handlers/raw-calls/beach-club/get-user-beach-club-data'

export const getCachedUserBeachClubData = async (walletAddress: string) => {
  return await unstableCache(getUserBeachClubData, [walletAddress], {
    revalidate: 600, // 10 minutes
    tags: [REVALIDATION_TAGS.PORTFOLIO_DATA, walletAddress.toLowerCase()],
  })(walletAddress)
}
