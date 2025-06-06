/* eslint-disable camelcase */
import { getBeachClubDb } from '@summerfi/summer-beach-club-db'

interface BeachClubRewardBalance {
  currency: string
  balance: string
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
}

const defaultBeachClubData: BeachClubData = {
  referral_code: null,
  active_users_count: null,
  custom_code: null,
  total_deposits_referred_usd: null,
  rewards: [],
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
        'currency',
        'balance',
        'amount_per_day',
        'amount_per_day_usd',
        'total_earned',
        'total_claimed',
      ])
      .where('referral_code_id', '=', basicData.referral_code)
      .execute()

    return {
      ...basicData,
      rewards: rewardsData,
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error getting referral code', error)

    return defaultBeachClubData
  } finally {
    await beachClubDb.db.destroy()
  }
}
