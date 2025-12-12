import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'

export type TallyDelegate = {
  bio: string
  delegatorsCountV1: string
  delegatorsCountV2: string
  displayName: string
  ens: string
  photo: string
  updatedAt: string
  userAddress: string
  votePowerV1: string
  votesCountV1: string
  votesCountNormalizedV1: string
  votePowerV2: string
  votesCountV2: string
  votesCountNormalizedV2: string
  x: string
  forumUrl: string
  customTitle: string
  customBio: string
}

export const getTallyDelegates = async (currentDelegate?: string): Promise<TallyDelegate[]> => {
  const { EARN_PROTOCOL_DB_CONNECTION_STRING } = process.env

  if (!EARN_PROTOCOL_DB_CONNECTION_STRING) {
    throw new Error('EARN_PROTOCOL_DB_CONNECTION_STRING is not set')
  }

  let database

  try {
    database = await getSummerProtocolDB({
      connectionString: EARN_PROTOCOL_DB_CONNECTION_STRING,
    })

    const delegatesV1Gov = await database.db
      .selectFrom('tallyDelegates')
      .selectAll()
      .orderBy('votesCount', 'desc')
      .limit(40)
      .execute()

    const delegatesV2Gov = await database.db
      .selectFrom('tallyDelegatesV2')
      .selectAll()
      .orderBy('votesCount', 'desc')
      .limit(40)
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

    // fetch current delegate if provided to get access to displayName etc.
    // without explicitly fetching it on the client side
    if (currentDelegate) {
      const delegate = delegates.find(
        (d) => d.userAddress.toLowerCase() === currentDelegate.toLowerCase(),
      )

      if (delegate) {
        const filteredDelegates = delegates.filter(
          (d) => d.userAddress.toLowerCase() !== currentDelegate.toLowerCase(),
        )

        return [delegate, ...filteredDelegates]
      }
    }

    return delegates
  } catch (error) {
    throw new Error('Failed to connect to database', { cause: error })
  } finally {
    if (database) {
      await database.db.destroy()
    }
  }
}
