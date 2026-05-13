import { getSummerProtocolDB, type SummerProtocolDB } from '@summerfi/summer-protocol-db'

let dbInstance: SummerProtocolDB | null = null

export async function getDb(): Promise<SummerProtocolDB['db']> {
  if (!dbInstance) {
    const connectionString = process.env.EARN_PROTOCOL_DB_CONNECTION_STRING

    if (!connectionString) {
      throw new Error('EARN_PROTOCOL_DB_CONNECTION_STRING is not set')
    }

    dbInstance = await getSummerProtocolDB({
      connectionString,
      pool: {
        max: 1,
        idleTimeoutMillis: 300_000,
        acquireTimeoutMillis: 10_000,
      },
    })
  }

  return dbInstance.db
}
