import { getBeachClubDb } from '@summerfi/summer-beach-club-db'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const paramsSchema = z.object({
  referralCode: z.string(),
})

export async function GET(_request: NextRequest, { params }: { params: { referralCode: string } }) {
  const validatedParams = paramsSchema.parse(await params)
  const { referralCode } = validatedParams

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
    const referralCodeData = await beachClubDb.db
      .selectFrom('referral_codes')
      .select(['id', 'custom_code'])
      .where((eb) => eb.or([eb('custom_code', '=', referralCode), eb('id', '=', referralCode)]))
      .executeTakeFirst()

    if (!referralCodeData) {
      return NextResponse.json(
        { valid: false, customCode: null, referralCode: null },
        { status: 400 },
      )
    }

    return NextResponse.json({
      valid: true,
      customCode: referralCodeData.custom_code,
      referralCode: referralCodeData.id,
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error validating referral code', error)

    return NextResponse.json({ error: 'Error validating referral code' }, { status: 500 })
  } finally {
    await beachClubDb.db.destroy()
  }
}
