import { verifyAccessToken } from '@summerfi/app-utils'
import type { Kysely } from 'kysely'
import { type NextRequest, NextResponse } from 'next/server'
import * as z from 'zod'

import { checkIfRisky } from '@/server/helpers/check-if-risky'
import { createRiskForAddress } from '@/server/helpers/create-risk-for-address'
import { selectRiskForAddress } from '@/server/helpers/selectRiskForAddress'
import { updateRiskForAddress } from '@/server/helpers/updateRiskForAddress'
import { type RiskRequiredDB } from '@/types'

const offset = 14 * 24 * 60 * 60 * 1000 // 14 days

const inputSchema = z.object({
  chainId: z.number(),
  walletAddress: z.string(),
  cookiePrefix: z.string(),
})

/**
 * Get the risk status of a wallet address.
 *
 * @param req - The Next.js request object.
 * @param trmApiKey - The API key for accessing the TRM risk assessment service.
 * @param db - The Kysely database instance.
 * @returns A NextResponse object containing the risk status or an error message.
 *
 * @remarks
 * This function checks the risk status of a given wallet address. It follows these steps:
 * 1. Parse and validate the request body to get the chain ID and wallet address.
 * 2. Verify the presence of an authentication token in the request cookies.
 * 3. Checks if a risk record for the address exists in the database.
 * 4. If no record exists, it fetches the risk status from the TRM service and creates a new record.
 * 5. If a record exists and is flagged as risky, it forces a re-check to verify the current risk status.
 * 6. If a record exists but is not flagged as risky, it checks if the record is older than the defined offset (14 days).
 * 7. If the record is outdated, it updates the risk status from the TRM service.
 * 8. Handles any errors that occur during the process and logs them.
 */
export const getRisk = async <DB extends RiskRequiredDB>({
  req,
  trmApiKey,
  db,
  jwtSecret,
}: {
  req: NextRequest
  trmApiKey: string
  db: Kysely<DB>
  jwtSecret: string
}): Promise<
  NextResponse<
    | {
        authenticated: boolean
      }
    | {
        isRisky: boolean
      }
    | {
        error: string
      }
  >
> => {
  const { chainId, walletAddress, cookiePrefix } = inputSchema.parse(await req.json())

  const resolvedDB = db as unknown as Kysely<RiskRequiredDB>

  const token = req.cookies.get(`${cookiePrefix}-${walletAddress.toLowerCase()}`)

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  const decoded = await verifyAccessToken({ token: token.value, jwtSecret })

  if (!decoded) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  if (decoded.address.toLowerCase() !== walletAddress.toLowerCase()) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  try {
    // check if record exists
    const risk = await selectRiskForAddress({ db: resolvedDB, address: walletAddress })

    // create record in db
    if (!risk) {
      const isRisky = await checkIfRisky({
        address: walletAddress,
        apiKey: trmApiKey,
        chainId,
      })

      await createRiskForAddress({ db: resolvedDB, address: walletAddress, isRisky })

      return NextResponse.json({ isRisky })
    }

    // force re-check if wallet is still flagged as risky
    // it's necessary for cases where provider flags user as risky by mistake
    // and after a short period of time it's fixed on provider side
    if (risk.isRisky) {
      const isRisky = await checkIfRisky({
        address: walletAddress,
        apiKey: trmApiKey,
        chainId,
      })

      await updateRiskForAddress({ db: resolvedDB, address: walletAddress, isRisky })

      return NextResponse.json({ isRisky })
    }

    const lastCheckTime = new Date(risk.lastCheck).getTime()
    const now = new Date().getTime()

    // check if update needed
    if (now - lastCheckTime < offset) {
      return NextResponse.json({ isRisky: risk.isRisky })
    }

    // update
    const isRisky = await checkIfRisky({
      address: walletAddress,
      apiKey: trmApiKey,
      chainId,
    })

    await updateRiskForAddress({ db: resolvedDB, address: walletAddress, isRisky })

    return NextResponse.json({ isRisky })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to verify risk', error)

    return NextResponse.json({ error: `Failed to verify risk ${error}` }, { status: 500 })
  } finally {
    await db.destroy().catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error closing database connection:', err)
    })
  }
}
