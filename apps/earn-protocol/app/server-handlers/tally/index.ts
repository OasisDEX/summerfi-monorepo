import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'

export type TallyDelegate = {
  bio: string
  delegatorsCount: string
  displayName: string
  ens: string
  photo: string
  updatedAt: string
  userAddress: string
  votePower: string
  votesCount: string
  votesCountNormalized: string
  x: string
}

export const getTallyDelegates = async (): Promise<TallyDelegate[]> => {
  const { EARN_PROTOCOL_DB_CONNECTION_STRING } = process.env

  if (!EARN_PROTOCOL_DB_CONNECTION_STRING) {
    throw new Error('EARN_PROTOCOL_DB_CONNECTION_STRING is not set')
  }

  let database

  try {
    database = await getSummerProtocolDB({
      connectionString: EARN_PROTOCOL_DB_CONNECTION_STRING,
    })

    const delegates = await database.db
      .selectFrom('tallyDelegates')
      .selectAll()
      .orderBy('votesCount', 'desc')
      .limit(40)
      .execute()

    return delegates
  } catch (error) {
    throw new Error('Failed to connect to database', { cause: error })
  } finally {
    if (database) {
      await database.db.destroy()
    }
  }
}
