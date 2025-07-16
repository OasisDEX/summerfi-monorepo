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
  const getFormIoKey = process.env.GET_FORM_IO_KEY

  if (!connectionString) {
    return NextResponse.json(
      { error: 'Beach Club DB Connection string is not set' },
      { status: 500 },
    )
  }

  if (!getFormIoKey) {
    return NextResponse.json({ error: 'Get Form key is not set' }, { status: 500 })
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

    return NextResponse.json({ error: 'Invalid reCAPTCHA token' }, { status: 400 })
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
      return NextResponse.json({ error: 'Error while getting client' }, { status: 500 })
    }

    const isSignatureValid = await client.verifyMessage({
      address: walletAddress,
      message: messageToSign,
      signature: signature as `0x${string}`,
    })

    if (!isSignatureValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
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
      return NextResponse.json({ error: 'No points found' }, { status: 404 })
    }

    const { balance, referral_code_id, total_claimed } = beachClubPoints

    if (!balance || !referral_code_id || !total_claimed) {
      return NextResponse.json({ error: 'No points found' }, { status: 404 })
    }

    if (Number(balance) < pointsRequired[type]) {
      return NextResponse.json({ error: 'Not enough points' }, { status: 400 })
    }

    // Convert to URLSearchParams to match getForm expectations
    const encoded = new URLSearchParams()

    for (const [key, value] of Object.entries({ ...formValues, walletAddress, type })) {
      encoded.append(key, value)
    }

    // send to getForm endpoint
    const getFormResponse = await fetch(`https://getform.io/f/${getFormIoKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: encoded.toString(),
    })

    if (!getFormResponse.ok) {
      return NextResponse.json({ error: 'Failed to send form data' }, { status: 500 })
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

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await beachClubDb.db.destroy()
  }
}
