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

  const sortBy = searchParams.get('sortBy')

  const result = EnsOrAddressOrNameSchema.safeParse({ ensOrAddressOrName, sortBy })

  if (!result.success) {
    return NextResponse.json({ error: 'Invalid ENS or address or name' }, { status: 400 })
  }

  const { ensOrAddressOrName: validatedEnsOrAddressOrName } = result.data

  let database

  try {
    database = await getSummerProtocolDB({
      connectionString: EARN_PROTOCOL_DB_CONNECTION_STRING,
    })

    const sanitizedInput = validatedEnsOrAddressOrName.replace(/[%_]/gu, '\\$&')

    const delegatesV1Gov = await database.db
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
      .limit(5)
      .execute()
    const delegatesV2Gov = await database.db
      .selectFrom('tallyDelegatesV2')
      .selectAll()
      .where((eb) =>
        eb.or([
          eb('ens', 'ilike', `%${sanitizedInput}%`),
          eb('userAddress', 'ilike', `%${sanitizedInput}%`),
          eb('displayName', 'ilike', `%${sanitizedInput}%`),
          eb('customTitle', 'ilike', `%${sanitizedInput}%`),
        ]),
      )
      .limit(5)
      .execute()

    // A map of V2 delegates by address for easy lookup
    const v2Map = new Map(delegatesV2Gov.map((d) => [d.userAddress.toLowerCase(), d]))

    // Merge delegates: V2 takes precedence, with versioned vote fields
    const mergedDelegates = delegatesV1Gov.map((v1Delegate) => {
      const v2Delegate = v2Map.get(v1Delegate.userAddress.toLowerCase())

      if (v2Delegate) {
        v2Map.delete(v1Delegate.userAddress.toLowerCase())

        return {
          bio: v2Delegate.bio,
          delegatorsCountV1: v1Delegate.delegatorsCount,
          delegatorsCountV2: v2Delegate.delegatorsCount,
          displayName: v2Delegate.displayName,
          ens: v2Delegate.ens,
          photo: v2Delegate.photo,
          updatedAt: v2Delegate.updatedAt,
          userAddress: v2Delegate.userAddress,
          votePowerV1: v1Delegate.votePower,
          votesCountV1: v1Delegate.votesCount,
          votesCountNormalizedV1: v1Delegate.votesCountNormalized,
          votePowerV2: v2Delegate.votePower,
          votesCountV2: v2Delegate.votesCount,
          votesCountNormalizedV2: v2Delegate.votesCountNormalized,
          x: v2Delegate.x,
          forumUrl: v2Delegate.forumUrl,
          customTitle: v2Delegate.customTitle,
          customBio: v2Delegate.customBio,
        }
      }

      return {
        ...v1Delegate,
        delegatorsCountV1: v1Delegate.delegatorsCount,
        delegatorsCountV2: '',
        votePowerV1: v1Delegate.votePower,
        votesCountV1: v1Delegate.votesCount,
        votesCountNormalizedV1: v1Delegate.votesCountNormalized,
        votePowerV2: '',
        votesCountV2: '',
        votesCountNormalizedV2: '',
      }
    })

    // Add remaining V2-only delegates
    const v2OnlyDelegates = Array.from(v2Map.values()).map((v2Delegate) => ({
      bio: v2Delegate.bio,
      delegatorsCountV1: '',
      delegatorsCountV2: v2Delegate.delegatorsCount,
      displayName: v2Delegate.displayName,
      ens: v2Delegate.ens,
      photo: v2Delegate.photo,
      updatedAt: v2Delegate.updatedAt,
      userAddress: v2Delegate.userAddress,
      votePowerV1: '',
      votesCountV1: '',
      votesCountNormalizedV1: '',
      votePowerV2: v2Delegate.votePower,
      votesCountV2: v2Delegate.votesCount,
      votesCountNormalizedV2: v2Delegate.votesCountNormalized,
      x: v2Delegate.x,
      forumUrl: v2Delegate.forumUrl,
      customTitle: v2Delegate.customTitle,
      customBio: v2Delegate.customBio,
    }))

    const delegates = [...mergedDelegates, ...v2OnlyDelegates]

    return NextResponse.json(delegates)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to connect to database' }, { status: 500 })
  } finally {
    if (database) {
      await database.db.destroy()
    }
  }
}
