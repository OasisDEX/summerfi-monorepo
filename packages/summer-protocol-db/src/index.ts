import { Database } from './database-types'
import { CamelCasePlugin, Kysely } from 'kysely'
import { PostgresJSDialect } from 'kysely-postgres-js'
import postgres from 'postgres'

export interface PgSummerProtocolDbConfig {
  connectionString: string
  pool?: {
    min?: number
    max?: number
    idleTimeoutMillis?: number
    acquireTimeoutMillis?: number
  }
}

export interface SummerProtocolDB {
  db: Kysely<Database>
}

export * from './database-types'
export { mapDbNetworkToChainId, mapChainIdToDbNetwork } from './helpers'
export const getSummerProtocolDB = async (
  config: PgSummerProtocolDbConfig,
): Promise<SummerProtocolDB> => {
  const pg = postgres(config.connectionString, {
    max: config.pool?.max ?? 10,
    idle_timeout: config.pool?.idleTimeoutMillis ?? 0,
    connect_timeout: config.pool?.acquireTimeoutMillis ?? 30000,
  })

  const db = new Kysely<Database>({
    dialect: new PostgresJSDialect({
      postgres: pg,
    }),
    plugins: [new CamelCasePlugin()],
  })

  return {
    db,
  }
}
