import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { updateTablesData } from '@/app/server-handlers/tables-data'
import { UpdateTables } from '@/app/server-handlers/tables-data/types'

const updateTablesSchema = z.object({
  tablesToUpdate: z.array(
    z.enum([
      UpdateTables.LatestActivity,
      UpdateTables.TopDepositors,
      UpdateTables.RebalanceActivity,
    ]),
  ),
})

type UpdateTablesRequest = z.infer<typeof updateTablesSchema>

export async function POST(req: NextRequest) {
  const connectionString = process.env.EARN_PROTOCOL_DB_CONNECTION_STRING

  if (!connectionString) {
    return NextResponse.json(
      { error: 'Summer Protocol DB Connection string is not set' },
      { status: 500 },
    )
  }
  // Validate request body
  let body: UpdateTablesRequest

  try {
    const json = await req.json()

    body = updateTablesSchema.parse(json)
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body. Expected tablesToUpdate array.' },
      { status: 400 },
    )
  }

  let dbInstance: Awaited<ReturnType<typeof getSummerProtocolDB>> | undefined

  try {
    dbInstance = await getSummerProtocolDB({
      connectionString,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to connect to database' }, { status: 500 })
  }
  const authHeader = req.headers.get('authorization')
  const expectedAuth = process.env.EARN_PROTOCOL_UPDATE_TABLES_AUTH_TOKEN

  if (!expectedAuth) {
    dbInstance.db.destroy()

    return NextResponse.json({ error: 'Authorization token is not configured' }, { status: 500 })
  }

  if (!authHeader || authHeader !== `Bearer ${expectedAuth}`) {
    dbInstance.db.destroy()

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return await updateTablesData({ db: dbInstance.db, tablesToUpdate: body.tablesToUpdate })
}
