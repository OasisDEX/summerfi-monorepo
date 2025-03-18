import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import { type NextRequest, NextResponse } from 'next/server'

import { updateTablesData } from '@/app/server-handlers/tables-data'

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
  // TODO ADD AUTHORIZATION

  return await updateTablesData({ db, _req: req })
}
