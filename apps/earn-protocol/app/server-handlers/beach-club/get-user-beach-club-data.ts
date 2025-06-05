import { getBeachClubDb } from '@summerfi/summer-beach-club-db'

export const getUserBeachClubData = async (walletAddress: string) => {
  const beachClubDbConnectionString = process.env.BEACH_CLUB_REWARDS_DB_CONNECTION_STRING

  if (!beachClubDbConnectionString) {
    throw new Error('Beach Club Rewards DB Connection string is not set')
  }

  const beachClubDb = getBeachClubDb({
    connectionString: beachClubDbConnectionString,
  })

  try {
    const referralCode = await beachClubDb.db
      .selectFrom('users')
      .select('referral_code')
      .where('id', '=', walletAddress.toLowerCase())
      .executeTakeFirst()

    if (referralCode?.referral_code) {
      const customReferralCode = await beachClubDb.db
        .selectFrom('referral_codes')
        .select('custom_code')
        .where('id', '=', referralCode.referral_code)
        .executeTakeFirst()

      return customReferralCode?.custom_code ?? referralCode.referral_code
    }

    return null
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error getting referral code', error)

    return null
  } finally {
    await beachClubDb.db.destroy()
  }
}
