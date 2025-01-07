import type { Kysely } from 'kysely'
import { type NextRequest, NextResponse } from 'next/server'
import * as z from 'zod'

import { verifyAccessToken } from '@/server/helpers/verify-access-token'
import { type TOSRequiredDB } from '@/types'

const tosSchema = z.object({
  docVersion: z.string(),
  walletAddress: z.string(),
  cookiePrefix: z.string(),
})

/**
 * Handle the Terms of Service (ToS) signing process.
 *
 * @param req - The NextRequest object containing the request details.
 * @param secret - The secret key used to verify the JWT token.
 * @param db - The Kysely database instance.
 * @returns A NextResponse object indicating the status of the ToS signing process.
 *
 * @remarks
 * This function validates the ToS document version and wallet address from the request, verifies the JWT token from the cookies,
 * and updates or inserts the ToS approval record in the database. If the token is invalid or missing, it returns a 401 status.
 */
export async function signTos<DB extends TOSRequiredDB>({
  req,
  jwtSecret,
  db,
}: {
  req: NextRequest
  jwtSecret: string
  db: Kysely<DB>
}) {
  const resolvedDB = db as unknown as Kysely<TOSRequiredDB>

  const { docVersion, walletAddress, cookiePrefix } = tosSchema.parse(await req.json())

  const token = req.cookies.get(`${cookiePrefix}-${walletAddress.toLowerCase()}`)

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  const decoded = verifyAccessToken({ token: token.value, jwtSecret })

  if (!decoded) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  if (decoded.address.toLowerCase() !== walletAddress.toLowerCase()) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  const approvalData = {
    address: decoded.address,
    signature: decoded.signature,
    message: decoded.challenge,
    chainId: decoded.chainId,
    docVersion,
    signDate: new Date(),
  }

  const queryResult = await resolvedDB
    .selectFrom('tosApproval')
    .where(({ eb, and }) =>
      and([eb('address', '=', decoded.address), eb('docVersion', '=', docVersion)]),
    )
    .selectAll()
    .execute()

  const [currentRecord] = queryResult

  if (currentRecord) {
    await resolvedDB
      .updateTable('tosApproval')
      .where(({ eb, and }) =>
        and([
          eb('address', '=', currentRecord.address),
          eb('docVersion', '=', currentRecord.docVersion),
          eb('chainId', '=', currentRecord.chainId),
        ]),
      )
      .set(approvalData)
      .execute()
  } else {
    await resolvedDB.insertInto('tosApproval').values(approvalData).execute()
  }

  return NextResponse.json({ docVersion })
}
