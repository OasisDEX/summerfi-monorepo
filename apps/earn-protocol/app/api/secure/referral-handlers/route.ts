import { getBeachClubDb } from '@summerfi/summer-beach-club-db'
import { type NextRequest, NextResponse } from 'next/server'
import { isAddress } from 'viem'

import { SECURE_PAGE_COOKIE_NAME } from '@/app/secure/constants'
import { sanitizeReferralCode } from '@/helpers/sanitize-referral-code'

export async function POST(req: NextRequest) {
  const cookieData = req.cookies

  const isAuthenticated =
    cookieData.has(SECURE_PAGE_COOKIE_NAME) &&
    cookieData.get(SECURE_PAGE_COOKIE_NAME)?.value === process.env.SECURE_PAGE_COOKIE_AUTH_TOKEN

  if (!isAuthenticated) {
    return NextResponse.json(
      { error: 'You are not authorized to perform this action' },
      { status: 403 },
    )
  }

  const formData = await req.formData()
  const referralCodeId = formData.get('referralCodeId') as string
  const newCustomCode = formData.get('customCode') as string
  const manualWalletAddress = formData.get('manualWalletAddress') as string

  if (
    (typeof referralCodeId !== 'string' || typeof newCustomCode !== 'string') &&
    !manualWalletAddress
  ) {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  if (manualWalletAddress && !isAddress(manualWalletAddress)) {
    return NextResponse.json({ error: 'Invalid manual wallet address' }, { status: 400 })
  }

  const beachClubDbConnectionString = process.env.BEACH_CLUB_REWARDS_DB_CONNECTION_STRING

  if (!beachClubDbConnectionString) {
    throw new Error('Beach Club Rewards DB Connection string is not set')
  }

  let beachClubDbInstance: Awaited<ReturnType<typeof getBeachClubDb>> | undefined

  try {
    beachClubDbInstance = getBeachClubDb({
      connectionString: beachClubDbConnectionString,
    })
    if (manualWalletAddress) {
      const addRefferalCode = await beachClubDbInstance.db
        .insertInto('users')
        .values({
          id: manualWalletAddress.toLowerCase(),
        })
        .returning('referral_code')
        .executeTakeFirst()

      const referralCode = addRefferalCode?.referral_code

      if (!referralCode) {
        return NextResponse.json({ error: 'Failed to generate referral code' }, { status: 500 })
      }

      return NextResponse.json({ referralCode })
    } else {
      if (!referralCodeId) {
        throw new Error('Missing required fields')
      }

      await beachClubDbInstance.db
        .updateTable('referral_codes')
        // eslint-disable-next-line camelcase
        .set({ custom_code: sanitizeReferralCode(newCustomCode) })
        .where('id', '=', referralCodeId)
        .execute()

      return NextResponse.json(
        { success: true, message: 'Custom code updated successfully' },
        { status: 200 },
      )
    }
  } finally {
    await beachClubDbInstance?.db.destroy()
  }
}
