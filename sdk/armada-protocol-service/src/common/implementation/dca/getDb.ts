import { getSummerProtocolDB, type SummerProtocolDB } from '@summerfi/summer-protocol-db'

/**
 * Module-scoped singleton so each warm Lambda execution environment reuses the
 * same pg Pool instead of opening a fresh connection on every invocation.
 */
let dbInstance: SummerProtocolDB | null = null

export type SummerProtocolDb = SummerProtocolDB['db']
export type SummerProtocolDbProvider = () => Promise<SummerProtocolDb>

export async function getDb(): Promise<SummerProtocolDb> {
  if (!dbInstance) {
    const connectionString = process.env.EARN_PROTOCOL_DB_CONNECTION_STRING

    if (!connectionString) {
      throw new Error('EARN_PROTOCOL_DB_CONNECTION_STRING is not set')
    }

    dbInstance = await getSummerProtocolDB({
      connectionString,
      pool: {
        // Lambda handles one request at a time; 4 avoids serialization without
        // over-allocating across provisioned-concurrency instances.
        max: 4,
        // Release idle connections after 60 s — short enough to limit footprint,
        // long enough to survive brief traffic lulls without reconnect churn.
        idleTimeoutMillis: 60_000,
        // 10 s acquisition timeout fits comfortably inside the 30 s Lambda limit.
        acquireTimeoutMillis: 10_000,
      },
    })
  }

  return dbInstance.db
}
