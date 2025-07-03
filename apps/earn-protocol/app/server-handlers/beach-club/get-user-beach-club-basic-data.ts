/* eslint-disable camelcase */
import { getBeachClubDb } from '@summerfi/summer-beach-club-db'
import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'

export interface BeachClubBasicData {
  referral_code: string | null
  active_users_count: number | null
  custom_code: string | null
  total_deposits_referred_usd: string | null
}

const defaultBeachClubData: BeachClubBasicData = {
  referral_code: null,
  active_users_count: null,
  custom_code: null,
  total_deposits_referred_usd: null,
}

export const getUserBeachClubBasicData = async (
  walletAddress: string,
): Promise<BeachClubBasicData> => {
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

    return basicData
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error getting referral code', error)

    return defaultBeachClubData
  } finally {
    await beachClubDb.db.destroy()
    await summerProtocolDB?.db.destroy()
  }
}
