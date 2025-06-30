import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const EnsOrAddressOrNameSchema = z.object({
  ensOrAddressOrName: z.string(),
})

export async function GET(request: NextRequest) {
  const { EARN_PROTOCOL_DB_CONNECTION_STRING } = process.env

  if (!EARN_PROTOCOL_DB_CONNECTION_STRING) {
    return NextResponse.json(
      { error: 'EARN_PROTOCOL_DB_CONNECTION_STRING is not set' },
      { status: 500 },
    )
  }

  const { searchParams } = new URL(request.url)
  const ensOrAddressOrName = searchParams.get('ensOrAddressOrName')

  if (!ensOrAddressOrName) {
    return NextResponse.json(
      { error: 'ensOrAddressOrName query parameter is required' },
      { status: 400 },
    )
  }

  const result = EnsOrAddressOrNameSchema.safeParse({ ensOrAddressOrName })

  if (!result.success) {
    return NextResponse.json({ error: 'Invalid ENS or address or name' }, { status: 400 })
  }

  const { ensOrAddressOrName: validatedEnsOrAddressOrName } = result.data

  let database

  try {
    database = await getSummerProtocolDB({
      connectionString: EARN_PROTOCOL_DB_CONNECTION_STRING,
    })

    const delegates = await database.db
      .selectFrom('tallyDelegates')
      .selectAll()
      .where((eb) =>
        eb.or([
          eb('ens', 'ilike', `%${validatedEnsOrAddressOrName}%`),
          eb('userAddress', 'ilike', `%${validatedEnsOrAddressOrName}%`),
          eb('displayName', 'ilike', `%${validatedEnsOrAddressOrName}%`),
        ]),
      )
      .limit(5)
      .execute()

    return NextResponse.json(delegates)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to connect to database' }, { status: 500 })
  } finally {
    if (database) {
      await database.db.destroy()
    }
  }
}
