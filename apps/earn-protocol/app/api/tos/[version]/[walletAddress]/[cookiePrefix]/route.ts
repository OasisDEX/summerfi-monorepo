import { getTos, type TOSRequestContext } from '@summerfi/app-tos'
import { parseServerResponseToClient } from '@summerfi/app-utils'
import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import { type NextRequest, NextResponse } from 'next/server'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'

export async function GET(req: NextRequest, context: TOSRequestContext) {
  const connectionString = process.env.EARN_PROTOCOL_DB_CONNECTION_STRING

  if (!connectionString) {
    return NextResponse.json(
      { error: 'Summer Protocol DB Connection string is not set' },
      { status: 500 },
    )
  }

  const [{ db }, configRaw, params] = await Promise.all([
    getSummerProtocolDB({
      connectionString,
    }),
    getCachedConfig(),
    context.params,
  ])
  const systemConfig = parseServerResponseToClient(configRaw)
  const whitelistedTos = systemConfig.tosWhitelist

  if (whitelistedTos?.includes(params.walletAddress.toLowerCase())) {
    db.destroy()

    return NextResponse.json({ acceptance: true, authorized: true })
  }

  const jwtSecret = process.env.EARN_PROTOCOL_JWT_SECRET

  if (!jwtSecret) {
    db.destroy()

    return NextResponse.json({ error: 'Required ENV variable is not set' }, { status: 500 })
  }

  return await getTos({ req, context, jwtSecret, db })
}
