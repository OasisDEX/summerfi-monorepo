import { REVALIDATION_TAGS } from '@summerfi/app-earn-ui'
import { unstable_cache as unstableCache } from 'next/cache'

import { getBeachClubRecruitedUsersServerSide } from '@/app/server-handlers/raw-calls/beach-club/api'
import { getUserBeachClubData } from '@/app/server-handlers/raw-calls/beach-club/get-user-beach-club-data'
import { type TableSortOrder } from '@/app/server-handlers/tables-data/types'

export const getCachedUserBeachClubData = async (walletAddress: string) => {
  return await unstableCache(getUserBeachClubData, [walletAddress], {
    revalidate: 600, // 10 minutes
    tags: [REVALIDATION_TAGS.PORTFOLIO_DATA, walletAddress.toLowerCase()],
  })(walletAddress)
}

export const getCachedBeachClubRecruitedUsersServerSide = async ({
  page,
  limit,
  referralCode,
  orderBy = 'desc',
}: {
  page: number
  limit: number
  referralCode: string
  orderBy?: TableSortOrder
}) => {
  return await unstableCache(getBeachClubRecruitedUsersServerSide, [], {
    revalidate: 300, // 10 minutes
    tags: [],
  })({
    page,
    limit,
    referralCode,
    orderBy,
  })
}
