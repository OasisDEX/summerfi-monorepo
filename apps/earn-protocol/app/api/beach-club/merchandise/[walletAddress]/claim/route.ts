/* eslint-disable camelcase */
import { SDKChainId } from '@summerfi/app-types'
import { addressSchema } from '@summerfi/serverless-shared'
import { getBeachClubDb } from '@summerfi/summer-beach-club-db'
import { type NextRequest, NextResponse } from 'next/server'
import z from 'zod'

import { validateCaptcha } from '@/features/captcha/validate-captcha'
import { merchandiseFormValuesSchema } from '@/features/merchandise/helpers/form-schema'
import { getMerchandiseMessageToSign } from '@/features/merchandise/helpers/get-messageToSign'
import { MerchandiseType } from '@/features/merchandise/types'
import { getSSRPublicClient } from '@/helpers/get-ssr-public-client'

const pointsRequired = {
  [MerchandiseType.T_SHIRT]: 5000,
  [MerchandiseType.HOODIE]: 10000,
  [MerchandiseType.NFT]: 1000,
}

const pathParamsSchema = z.object({
  walletAddress: addressSchema,
})

const postBodyParamsSchema = z.object({
  signature: z.string().nonempty('Signature is required'),
  formValues: merchandiseFormValuesSchema,
  type: z.nativeEnum(MerchandiseType),
  token: z
    .string()
    .nonempty('reCAPTCHA token is required')
    .refine((token) => token.length > 0, {
      message: 'reCAPTCHA token must not be empty',
    }),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ walletAddress: string }> },
) {
  const connectionString = process.env.BEACH_CLUB_REWARDS_DB_CONNECTION_STRING

  if (!connectionString) {
    return NextResponse.json(
      { errors: ['Beach Club DB Connection string is not set'] },
      { status: 500 },
    )
  }

  let validatedPathParams
  let validatedPostBody

  try {
    validatedPathParams = pathParamsSchema.parse(await params)
    validatedPostBody = postBodyParamsSchema.parse(await req.json())
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Invalid parameters',
        details: err instanceof z.ZodError ? err.errors : String(err),
      },
      { status: 400 },
    )
  }

  const { walletAddress } = validatedPathParams
  const { formValues, signature, type, token } = validatedPostBody

  const recaptchaData = await validateCaptcha(token)

  if (!recaptchaData) {
    // eslint-disable-next-line no-console
    console.log('Invalid reCAPTCHA token when claiming merchandise for user', walletAddress)

    return NextResponse.json({ errors: ['Invalid reCAPTCHA token'] }, { status: 400 })
  }

  const messageToSign = getMerchandiseMessageToSign({
    walletAddress,
    type,
  })

  const beachClubDb = getBeachClubDb({
    connectionString,
  })

  try {
    // chain id is not relevant for signature verification
    const client = await getSSRPublicClient(SDKChainId.BASE)

    if (!client) {
      return NextResponse.json({ errors: ['Error while getting client'] }, { status: 500 })
    }

    const isSignatureValid = await client.verifyMessage({
      address: walletAddress,
      message: messageToSign,
      signature: signature as `0x${string}`,
    })

    if (!isSignatureValid) {
      return NextResponse.json({ errors: ['Invalid signature'] }, { status: 400 })
    }

    // fetch current points balances
    const beachClubPoints = await beachClubDb.db
      .selectFrom('users')
      .leftJoin('rewards_balances', 'rewards_balances.referral_code_id', 'users.referral_code')
      .where('users.id', '=', walletAddress.toLowerCase())
      .select([
        'rewards_balances.balance',
        'rewards_balances.referral_code_id',
        'rewards_balances.total_claimed',
      ])
      .where('rewards_balances.currency', '=', 'points')
      .executeTakeFirst()

    if (!beachClubPoints) {
      return NextResponse.json({ errors: ['No points found'] }, { status: 404 })
    }

    const { balance, referral_code_id, total_claimed } = beachClubPoints

    if (!balance || !referral_code_id || !total_claimed) {
      return NextResponse.json({ errors: ['No points found'] }, { status: 404 })
    }

    const lastTimeClaimed = await beachClubDb.db
      .selectFrom('rewards_distributions')
      .select('created_at')
      .where('referral_code_id', '=', referral_code_id)
      .where('currency', '=', 'points')
      .where('description', '=', `merchandise_claim_${type}`)
      .orderBy('created_at', 'desc')
      .executeTakeFirst()

    const lastTimeClaimedDate = lastTimeClaimed?.created_at
      ? new Date(lastTimeClaimed.created_at)
      : null

    // Check if user has already claimed today (same calendar day)
    if (lastTimeClaimedDate) {
      const now = new Date()
      const lastClaim = new Date(lastTimeClaimedDate)

      // Check if both dates are on the same calendar day
      const isSameDay =
        lastClaim.getFullYear() === now.getFullYear() &&
        lastClaim.getMonth() === now.getMonth() &&
        lastClaim.getDate() === now.getDate()

      if (isSameDay) {
        // eslint-disable-next-line no-console
        console.log(
          'User',
          walletAddress,
          'tried to claim merchandise',
          type,
          'but already claimed today',
        )

        return NextResponse.json({ errors: ['You can only claim once per day'] }, { status: 200 })
      }
    }

    if (Number(balance) < pointsRequired[type]) {
      return NextResponse.json({ errors: ['Not enough points'] }, { status: 200 })
    }

    // Convert to URLSearchParams to match getForm expectations
    const encoded = new URLSearchParams()

    for (const [key, value] of Object.entries({ ...formValues, walletAddress, type })) {
      encoded.append(key, value)
    }

    // NFTs are not sent to getForm endpoint as this is digital merchandise
    // that can be claimed without any additional information
    if (type !== MerchandiseType.NFT) {
      // send to getForm endpoint
      const getFormResponse = await fetch(`https://getform.io/f/bxoyqjka`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: encoded.toString(),
      })

      if (!getFormResponse.ok) {
        return NextResponse.json({ errors: ['Failed to send form data'] }, { status: 500 })
      }
    }

    await beachClubDb.db
      .transaction()
      .execute(async (tx) => {
        const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        // update rewards distributions to ensure history is preserved
        await tx
          .insertInto('rewards_distributions')
          .values({
            referral_code_id,
            currency: 'points',
            amount: pointsRequired[type] * -1,
            description: `merchandise_claim_${type}`,
            batch_id: batchId,
          })
          .execute()

        // update rewards balances
        await tx
          .updateTable('rewards_balances')
          .set({
            balance: Number(balance) - pointsRequired[type],
            total_claimed: Number(total_claimed) + pointsRequired[type],
            updated_at: new Date(),
          })
          .where('referral_code_id', '=', referral_code_id)
          .where('currency', '=', 'points')
          .execute()
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(
          `Failed to update rewards distributions or balances for user ${walletAddress}`,
          err,
        )

        throw new Error(
          `Failed to update rewards distributions or balances for user ${walletAddress}`,
          err,
        )
      })

    return NextResponse.json({ success: 'Merchandise claimed successfully' }, { status: 200 })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Error while claiming merchandise for user', walletAddress, err)

    return NextResponse.json({ errors: ['Internal server error'] }, { status: 500 })
  } finally {
    await beachClubDb.db.destroy()
  }
}
