import { getBeachClubDb } from '@summerfi/summer-beach-club-db'
import BigNumber from 'bignumber.js'
import { NextResponse } from 'next/server'

import { type TableSortOrder } from '@/app/server-handlers/tables-data/types'
import {
  type BeachClubRecruitedUsersPagination,
  type BeachClubRewardBalance,
} from '@/features/beach-club/types'

export const defaultBeachClubRecruitedUsersPagination: BeachClubRecruitedUsersPagination = {
  data: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
}

/**
 * Retrieves paginated list of recruited users for a given referral code
 * @param {Object} params - The parameters object
 * @param {number} params.page - Current page number for pagination
 * @param {number} params.limit - Number of items per page
 * @param {string} params.referralCode - Referral code to filter recruited users
 * @param {TableSortOrder} [params.orderBy='desc'] - Sort order for TVL
 * @returns {Promise<NextResponse>} Response containing recruited users data and pagination info
 */
export const getBeachClubRecruitedUsersServerSide = async ({
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
  const beachClubDbConnectionString = process.env.BEACH_CLUB_REWARDS_DB_CONNECTION_STRING

  if (!beachClubDbConnectionString) {
    return NextResponse.json(
      { error: 'Beach Club Rewards DB Connection string is not set' },
      { status: 500 },
    )
  }

  const beachClubDb = getBeachClubDb({
    connectionString: beachClubDbConnectionString,
  })

  try {
    const recruitedUsers = await beachClubDb.db
      .selectFrom('users')
      .select(['id', 'referral_code'])
      .where('users.referrer_id', '=', referralCode)
      .limit(limit)
      .offset((page - 1) * limit)
      .execute()

    const [recruitedUsersCount, recruitedUsersRewards, recruitedUsersTvl] = await Promise.all([
      beachClubDb.db
        .selectFrom('users')
        .select((eb) => eb.fn.countAll().as('count'))
        .where('users.referrer_id', '=', referralCode)
        .executeTakeFirst(),
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
        .where(
          'referral_code_id',
          'in',
          recruitedUsers.length > 0
            ? recruitedUsers
                .map((user) => user.referral_code)
                .filter((code): code is string => code !== null)
            : [''],
        )
        .execute(),
      beachClubDb.db
        .selectFrom('positions')
        .select(['user_id'])
        .where(
          'user_id',
          'in',
          recruitedUsers.length > 0
            ? // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              recruitedUsers.map((user) => user.id).filter((id): id is string => id !== null)
            : [''],
        )
        .groupBy('user_id')
        .select(({ fn }) => [fn.sum('current_deposit_usd').as('tvl')])
        .orderBy('tvl', orderBy)
        .execute(),
    ])

    const recruitedUsersWithRewards = recruitedUsers.reduce<{
      [key: string]: (typeof recruitedUsers)[0] & {
        rewards: BeachClubRewardBalance[]
        tvl: string
      }
    }>((acc, user) => {
      if (!user.id || !user.referral_code) return acc
      acc[user.id] = {
        ...user,
        rewards: recruitedUsersRewards.filter(
          (reward) => reward.referral_code_id === user.referral_code,
        ),
        tvl: recruitedUsersTvl.find((tvl) => tvl.user_id === user.id)?.tvl.toString() ?? '0',
      }

      return acc
    }, {})

    const totalItems = Number(recruitedUsersCount?.count ?? 0)

    return NextResponse.json({
      data: Object.values(recruitedUsersWithRewards).map((user) => ({
        id: user.referral_code,
        address: user.id,
        tvl: user.tvl,
        earnedToDate: user.rewards
          .filter((reward) => reward.currency !== 'points')
          .reduce((acc, reward) => acc.plus(reward.balance_usd ?? '0'), new BigNumber(0))
          .toString(),
        forecastAnnualisedEarnings: user.rewards
          .filter((reward) => reward.currency !== 'points')
          .reduce(
            (acc, reward) => acc.plus(Number(reward.amount_per_day_usd ?? 0) * 365),
            new BigNumber(0),
          )
          .toString(),
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error getting recruited users', error)

    return NextResponse.json(defaultBeachClubRecruitedUsersPagination)
  } finally {
    await beachClubDb.db.destroy().catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error closing database connection:', err)
    })
  }
}

/**
 * Client-side function to fetch paginated recruited users data
 * @param {Object} params - The parameters object
 * @param {number} params.page - Current page number for pagination
 * @param {number} params.limit - Number of items per page
 * @param {string} params.referralCode - Referral code to filter recruited users
 * @param {TableSortOrder} [params.orderBy='desc'] - Sort order for TVL
 * @returns {Promise<BeachClubRecruitedUsersPagination>} Parsed response with recruited users data and pagination info
 */
export const getPaginatedBeachClubRecruitedUsers = async ({
  page,
  limit,
  referralCode,
  orderBy = 'desc',
}: {
  page: number
  limit: number
  referralCode: string
  orderBy?: TableSortOrder
}): Promise<BeachClubRecruitedUsersPagination> => {
  return await getBeachClubRecruitedUsersServerSide({ page, limit, referralCode, orderBy }).then(
    (res) => res.json(),
  )
}
