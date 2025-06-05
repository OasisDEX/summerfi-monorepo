import { addressSchema } from '@summerfi/serverless-shared'
import { getBeachClubDb } from '@summerfi/summer-beach-club-db'
import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const paramsSchema = z.object({
  walletAddress: addressSchema,
})

export async function POST(
  _request: NextRequest,
  { params }: { params: { walletAddress: string } },
) {
  try {
    const validatedParams = paramsSchema.parse(await params)
    const { walletAddress } = validatedParams

    const summerDbConnectionString = process.env.EARN_PROTOCOL_DB_CONNECTION_STRING
    const beachClubDbConnectionString = process.env.BEACH_CLUB_REWARDS_DB_CONNECTION_STRING

    if (!summerDbConnectionString) {
      return NextResponse.json(
        { error: 'Summer Protocol DB Connection string is not set' },
        { status: 500 },
      )
    }

    if (!beachClubDbConnectionString) {
      return NextResponse.json(
        { error: 'Beach Club Rewards DB Connection string is not set' },
        { status: 500 },
      )
    }

    let summerDbInstance: Awaited<ReturnType<typeof getSummerProtocolDB>> | undefined
    let beachClubDbInstance: Awaited<ReturnType<typeof getBeachClubDb>> | undefined

    try {
      summerDbInstance = await getSummerProtocolDB({
        connectionString: summerDbConnectionString,
      })

      beachClubDbInstance = getBeachClubDb({
        connectionString: beachClubDbConnectionString,
      })

      const existingUser = await summerDbInstance.db
        .selectFrom('latestActivity')
        .select('userAddress')
        .where('userAddress', '=', walletAddress.toLowerCase())
        .executeTakeFirst()

      if (existingUser) {
        const alreadyHaveReferralCode = await beachClubDbInstance.db
          .selectFrom('users')
          .select('referral_code')
          .where('id', '=', walletAddress.toLowerCase())
          .executeTakeFirst()

        if (alreadyHaveReferralCode) {
          return NextResponse.json({ referralCode: alreadyHaveReferralCode.referral_code })
        }

        const addRefferalCode = await beachClubDbInstance.db
          .insertInto('users')
          .values({
            id: walletAddress.toLowerCase(),
          })
          .returning('referral_code')
          .executeTakeFirst()

        const referralCode = addRefferalCode?.referral_code

        if (!referralCode) {
          return NextResponse.json({ error: 'Failed to generate referral code' }, { status: 500 })
        }

        return NextResponse.json({ referralCode })
      } else {
        return NextResponse.json(
          { error: 'You have to have at least one position to generate a referral code' },
          { status: 403 },
        )
      }
    } catch (error) {
      return NextResponse.json(
        {
          error: `Error occured while processing data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
        { status: 500 },
      )
    } finally {
      await summerDbInstance?.db.destroy()
      await beachClubDbInstance?.db.destroy()
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: `Error occured while validating parameters: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 400 },
    )
  }
}
