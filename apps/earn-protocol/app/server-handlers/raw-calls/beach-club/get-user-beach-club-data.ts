/* eslint-disable camelcase */
import { getBeachClubDb } from '@summerfi/summer-beach-club-db'
import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'

import { type BeachClubData } from '@/app/server-handlers/raw-calls/beach-club/types'
import { getClaimableMerkleRewards } from '@/app/server-handlers/raw-calls/merkle'
import {
  defaultLatestActivityPagination,
  getPaginatedLatestActivity,
} from '@/app/server-handlers/tables-data/latest-activity/api'

import {
  defaultBeachClubRecruitedUsersPagination,
  getPaginatedBeachClubRecruitedUsers,
} from './api'

const defaultBeachClubData: BeachClubData = {
  referral_code: null,
  active_users_count: null,
  custom_code: null,
  total_deposits_referred_usd: null,
  rewards: [],
  recruitedUsersWithRewards: {
    data: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
    },
  },
  recruitedUsersLatestActivity: {
    data: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
    },
    medianDeposit: 0,
    totalDeposits: 0,
    totalUniqueUsers: 0,
  },
  claimableRewardsPerChain: {
    perChain: {},
  },
}

export const getUserBeachClubData = async (walletAddress: string): Promise<BeachClubData> => {
  const beachClubDbConnectionString = process.env.BEACH_CLUB_REWARDS_DB_CONNECTION_STRING
  const summerProtocolDbConnectionString = process.env.EARN_PROTOCOL_DB_CONNECTION_STRING

  if (!beachClubDbConnectionString) {
    throw new Error('Beach Club Rewards DB Connection string is not set')
  }

  if (!summerProtocolDbConnectionString) {
    throw new Error('Summer Protocol DB Connection string is not set')
  }

  const beachClubDb = getBeachClubDb({
    connectionString: beachClubDbConnectionString,
  })

  let summerProtocolDB: Awaited<ReturnType<typeof getSummerProtocolDB>> | undefined

  try {
    summerProtocolDB = await getSummerProtocolDB({
      connectionString: summerProtocolDbConnectionString,
    })

    const basicData = await beachClubDb.db
      .selectFrom('users')
      .select('referral_code')
      .leftJoin('referral_codes', 'referral_codes.id', 'users.referral_code')
      .select(['custom_code', 'total_deposits_referred_usd', 'active_users_count'])
      .where('users.id', '=', walletAddress.toLowerCase())
      .executeTakeFirst()

    if (!basicData?.referral_code) {
      return defaultBeachClubData
    }

    const [rewardsData, recruitedUsers] = await Promise.all([
      beachClubDb.db
        .selectFrom('rewards_balances')
        .select([
          'referral_code_id',
          'currency',
          'balance',
          'balance_usd',
          'amount_per_day',
          'amount_per_day_usd',
          'total_earned',
          'total_claimed',
        ])
        .where('referral_code_id', '=', basicData.referral_code)
        .execute(),
      beachClubDb.db
        .selectFrom('users')
        .select(['id', 'referral_code'])
        .where('users.referrer_id', '=', basicData.referral_code)
        .execute(),
    ])

    const [recruitedUsersWithRewards, recruitedUsersLatestActivity] = await Promise.all([
      recruitedUsers.length > 0
        ? getPaginatedBeachClubRecruitedUsers({
            page: 1,
            limit: 10,
            referralCode: basicData.referral_code,
          })
        : defaultBeachClubRecruitedUsersPagination,
      recruitedUsers.length > 0
        ? getPaginatedLatestActivity({
            usersAddresses: recruitedUsers.map((user) => user.id.toLowerCase()),
            page: 1,
            limit: 10,
          })
        : defaultLatestActivityPagination,
    ])

    // these are fees rewards
    const claimableRewardsPerChain = await getClaimableMerkleRewards(walletAddress)

    return {
      ...basicData,
      rewards: rewardsData,
      claimableRewardsPerChain,
      recruitedUsersWithRewards,
      recruitedUsersLatestActivity,
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error getting referral code', error)

    return defaultBeachClubData
  } finally {
    await beachClubDb.db.destroy()
    await summerProtocolDB?.db.destroy()
  }
}
