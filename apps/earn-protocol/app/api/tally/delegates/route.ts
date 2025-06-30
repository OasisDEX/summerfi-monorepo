import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { DelegateSortOptions } from '@/features/claim-and-delegate/components/ClaimDelegateStep/sort-options'

const EnsOrAddressOrNameSchema = z.object({
  ensOrAddressOrName: z.string(),
  sortBy: z.nativeEnum(DelegateSortOptions),
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

  const sortBy = searchParams.get('sortBy')

  const result = EnsOrAddressOrNameSchema.safeParse({ ensOrAddressOrName, sortBy })

  if (!result.success) {
    return NextResponse.json({ error: 'Invalid ENS or address or name' }, { status: 400 })
  }

  const { ensOrAddressOrName: validatedEnsOrAddressOrName, sortBy: validatedSortBy } = result.data

  let database

  try {
    database = await getSummerProtocolDB({
      connectionString: EARN_PROTOCOL_DB_CONNECTION_STRING,
    })

    const sanitizedInput = validatedEnsOrAddressOrName.replace(/[%_]/gu, '\\$&')

    const delegates = await database.db
      .selectFrom('tallyDelegates')
      .selectAll()
      .where((eb) =>
        eb.or([
          eb('ens', 'ilike', `%${sanitizedInput}%`),
          eb('userAddress', 'ilike', `%${sanitizedInput}%`),
          eb('displayName', 'ilike', `%${sanitizedInput}%`),
          eb('customTitle', 'ilike', `%${sanitizedInput}%`),
        ]),
      )
      .orderBy(
        validatedSortBy === DelegateSortOptions.HIGHEST_VOTING_WEIGHT
          ? 'votesCountNormalized'
          : 'votePower',
        'desc',
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
