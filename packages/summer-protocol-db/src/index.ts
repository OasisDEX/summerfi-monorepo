import { Database } from './database-types'
import { CamelCasePlugin, Kysely } from 'kysely'
import { PostgresJSDialect } from 'kysely-postgres-js'
import postgres from 'postgres'

interface PgSummerProtocolDbConfig {
  connectionString: string
}

export interface SummerProtocolDB {
  db: Kysely<Database>
}

export * from './database-types'
export { mapDbNetworkToChainId, mapChainIdToDbNetwork } from './helpers'
export const getSummerProtocolDB = async (
  config: PgSummerProtocolDbConfig,
): Promise<SummerProtocolDB> => {
  const pg = postgres(config.connectionString)
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
