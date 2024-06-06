import { CamelCasePlugin, Kysely } from 'kysely'
import { PostgresJSDialect } from 'kysely-postgres-js'
import postgres from 'postgres'
import { Logger } from '@summerfi/abstractions'
import { DB } from './database-types'

export interface PgBorrowDbConfig {
  connectionString: string
  logger: Logger
}

export interface BorrowDB {
  db: Kysely<DB>
}

export const getBorrowDB = async (config: PgBorrowDbConfig): Promise<BorrowDB> => {
  const pg = postgres(config.connectionString)
  const db = new Kysely<DB>({
    dialect: new PostgresJSDialect({
      postgres: pg,
    }),
    plugins: [new CamelCasePlugin()],
  })

  return {
    db,
  }
}
