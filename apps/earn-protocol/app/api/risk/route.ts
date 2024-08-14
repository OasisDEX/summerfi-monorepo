import { getRisk } from '@summerfi/app-risk'
import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
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

  const trmApiKey = process.env.TRM_API_KEY

  if (!trmApiKey) {
    return NextResponse.json({ error: 'Required ENV variable is not set' }, { status: 500 })
  }

  return await getRisk({ req, trmApiKey, db })
}
