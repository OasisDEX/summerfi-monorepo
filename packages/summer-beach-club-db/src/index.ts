import { DB } from './database-types'
import { Kysely, PostgresDialect, sql } from 'kysely'
import { Pool } from 'pg'

export interface PgBeachClubDbConfig {
  connectionString: string
  pool?: {
    min?: number
    max?: number
    idleTimeoutMillis?: number
    acquireTimeoutMillis?: number
  }
}

export interface BeachClubDB {
  db: Kysely<DB>
}

export * from './database-types'
export { mapDbNetworkToChainId, mapChainIdToDbNetwork, type DbNetworks } from './helpers'

export const getBeachClubDb = async (config: PgBeachClubDbConfig): Promise<BeachClubDB> => {
  const db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: config.connectionString,
        max: config.pool?.max ?? 10,
        idleTimeoutMillis: config.pool?.idleTimeoutMillis ?? 0,
        connectionTimeoutMillis: config.pool?.acquireTimeoutMillis ?? 30000,
      }),
    }),
  })

  // Test the connection by executing a simple query
  try {
    await sql`SELECT 1`.execute(db)
  } catch (error) {
    await db.destroy()
    throw new Error(`Failed to connect to earn app database`)
  }

  return {
    db,
  }
}
