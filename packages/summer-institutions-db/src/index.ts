import { Database } from './database-types'
import { CamelCasePlugin, Kysely, PostgresDialect, sql } from 'kysely'
import { Pool } from 'pg'

export interface PgSummerProtocolInstitutionDbConfig {
  connectionString: string
  pool?: {
    min?: number
    max?: number
    idleTimeoutMillis?: number
    acquireTimeoutMillis?: number
  }
}

export interface SummerProtocolInstitutionDB {
  db: Kysely<Database>
}

export * from './database-types'
export { mapDbNetworkToChainId, mapChainIdToDbNetwork, type DbNetworks } from './helpers'
export type { ExpressionBuilder } from 'kysely'

export const getSummerProtocolInstitutionDB = async (
  config: PgSummerProtocolInstitutionDbConfig,
): Promise<SummerProtocolInstitutionDB> => {
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: config.connectionString,
        max: config.pool?.max ?? 10,
        idleTimeoutMillis: config.pool?.idleTimeoutMillis ?? 0,
        connectionTimeoutMillis: config.pool?.acquireTimeoutMillis ?? 30000,
      }),
    }),
    plugins: [new CamelCasePlugin()],
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
