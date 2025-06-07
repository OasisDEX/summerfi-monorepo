/* eslint-disable camelcase */
import { getBeachClubDb } from '@summerfi/summer-beach-club-db'

interface BeachClubRewardBalance {
  currency: string
  balance: string
  balance_usd: string | null
  amount_per_day: string
  amount_per_day_usd: string | null
  total_earned: string
  total_claimed: string
}

export interface BeachClubData {
  referral_code: string | null
  active_users_count: number | null
  custom_code: string | null
  total_deposits_referred_usd: string | null
  rewards: BeachClubRewardBalance[]
  recruitedUsersRewards: {
    [key: string]: {
      id: string
      referral_code: string | null
      tvl: string
      rewards: BeachClubRewardBalance[]
    }
  }
}

const defaultBeachClubData: BeachClubData = {
  referral_code: null,
  active_users_count: null,
  custom_code: null,
  total_deposits_referred_usd: null,
  rewards: [],
  recruitedUsersRewards: {},
}

export const getUserBeachClubData = async (walletAddress: string): Promise<BeachClubData> => {
  const beachClubDbConnectionString = process.env.BEACH_CLUB_REWARDS_DB_CONNECTION_STRING

  if (!beachClubDbConnectionString) {
    throw new Error('Beach Club Rewards DB Connection string is not set')
  }

  const beachClubDb = getBeachClubDb({
    connectionString: beachClubDbConnectionString,
  })

  try {
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

    const rewardsData = await beachClubDb.db
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
      .execute()

    const recruitedUsers = await beachClubDb.db
      .selectFrom('users')
      .select(['id', 'referral_code'])
      .where('users.referrer_id', '=', basicData.referral_code)
      .execute()

    const recruitedUsersRewards = await beachClubDb.db
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
      .execute()

    const recruitedUsersTvl = await beachClubDb.db
      .selectFrom('positions')
      .select(['user_id'])
      .where(
        'user_id',
        'in',
        recruitedUsers.length > 0
          ? recruitedUsers.map((user) => user.id).filter((id): id is string => id !== null)
          : [''],
      )
      .groupBy('user_id')
      .select(({ fn }) => [fn.sum('current_deposit_usd').as('tvl')])
      .execute()

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

    return {
      ...basicData,
      rewards: rewardsData,
      recruitedUsersRewards: recruitedUsersWithRewards,
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error getting referral code', error)

    return defaultBeachClubData
  } finally {
    await beachClubDb.db.destroy()
  }
}
