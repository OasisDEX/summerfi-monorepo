import { unstable_cache as unstableCache } from 'next/cache'

import { getBeachClubRecruitedUsersServerSide } from '@/app/server-handlers/raw-calls/beach-club/api'
import { getUserBeachClubData } from '@/app/server-handlers/raw-calls/beach-club/get-user-beach-club-data'
import { type TableSortOrder } from '@/app/server-handlers/tables-data/types'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'
import { getUserDataCacheHandler } from '@/helpers/get-user-data-cache-handler'

export const getCachedUserBeachClubData = async (walletAddress: string) => {
  return await unstableCache(getUserBeachClubData, [], {
    revalidate: CACHE_TIMES.BEACH_CLUB_PROFILE,
    tags: [getUserDataCacheHandler(walletAddress), CACHE_TAGS.BEACH_CLUB_PROFILE],
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
    revalidate: CACHE_TIMES.BEACH_CLUB_RECRUITS,
    tags: [CACHE_TAGS.BEACH_CLUB_RECRUITS, referralCode],
  })({
    page,
    limit,
    referralCode,
    orderBy,
  })
}
