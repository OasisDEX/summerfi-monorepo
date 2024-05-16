import { Database } from './database-types'
import { CamelCasePlugin, Kysely } from 'kysely'
import { PostgresJSDialect } from 'kysely-postgres-js'
import postgres from 'postgres'

export interface PgRaysDbConfig {
  connectionString: string
}

export * from './database-types'

export const getRaysDB = async (config: PgRaysDbConfig): Promise<Kysely<Database>> => {
  const pg = postgres(config.connectionString)
  return new Kysely<Database>({
    dialect: new PostgresJSDialect({
      postgres: pg,
    }),
    plugins: [new CamelCasePlugin()],
  })
}
