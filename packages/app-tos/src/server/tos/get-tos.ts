import { type Kysely } from 'kysely'
import { type NextRequest, NextResponse } from 'next/server'
import * as z from 'zod'

import { verifyAccessToken } from '@/server/helpers/verify-access-token'
import { type TOSRequestContext, type TOSRequiredDB } from '@/types'

const paramsSchema = z.object({
  version: z.string(),
  walletAddress: z.string(),
  cookiePrefix: z.string(),
})

/**
 * Retrieve Terms of Service (ToS) acceptance status for a given wallet address and version.
 *
 * @param req - The NextRequest object representing the incoming request.
 * @param context - The context object containing the parameters: version, walletAddress and cookiePrefix.
 * @param jwtSecret - The JWT secret.
 * @param db - The Kysely database instance.
 * @returns A NextResponse object containing the acceptance status and authorization status.
 *
 * @remarks
 * This function connects to the Summer Protocol database, verifies the access token from cookies, and retrieves
 * the ToS acceptance status for the specified wallet address and version.
 */
export async function getTos<DB extends TOSRequiredDB>({
  req,
  context,
  jwtSecret,
  db,
}: {
  req: NextRequest
  context: TOSRequestContext
  jwtSecret: string
  db: Kysely<DB>
}): Promise<
  NextResponse<{
    acceptance: boolean
    authorized: boolean
  }>
> {
  const { version, walletAddress, cookiePrefix } = paramsSchema.parse(await context.params)

  const resolvedDB = db as unknown as Kysely<TOSRequiredDB>

  const token = req.cookies.get(`${cookiePrefix}-${walletAddress.toLowerCase()}`)

  let authorized

  if (!token) {
    authorized = false
  } else {
    const decoded = await verifyAccessToken({ token: token.value, jwtSecret })

    if (decoded?.address.toLowerCase() !== walletAddress.toLowerCase()) {
      authorized = false
    } else {
      authorized = true
    }
  }

  const tos = await resolvedDB
    .selectFrom('tosApproval')
    .where(({ eb, and }) => and([eb('address', '=', walletAddress.toLowerCase())]))
    .select('docVersion')
    .where(({ eb, and }) => and([eb('docVersion', '=', version)]))
    .execute()

  await resolvedDB.destroy().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Error closing database connection:', err)
  })

  if (tos.length === 0) {
    return NextResponse.json({ acceptance: false, authorized })
  } else {
    return NextResponse.json(
      tos.find(({ docVersion }) => docVersion === version)
        ? { acceptance: true, authorized }
        : { acceptance: false, updated: true, authorized },
    )
  }
}
