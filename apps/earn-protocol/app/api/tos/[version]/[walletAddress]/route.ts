import { getTos, type TOSRequestContext } from '@summerfi/app-tos'
import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, context: TOSRequestContext) {
  const connectionString = process.env.EARN_PROTOCOL_DB_CONNECTION_STRING

  if (!connectionString) {
    return NextResponse.json(
      { error: 'Summer Protocol DB Connection string is not set' },
      { status: 500 },
    )
  }

  const { db } = await getSummerProtocolDB({
    connectionString,
  })

  const jwtSecret = process.env.EARN_PROTOCOL_JWT_SECRET

  if (!jwtSecret) {
    return NextResponse.json({ error: 'Required ENV variable is not set' }, { status: 500 })
  }

  return await getTos({ req, context, jwtSecret, db })
}
