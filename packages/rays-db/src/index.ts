import { Database } from './database-types'
import { CamelCasePlugin, Kysely } from 'kysely'
import { PostgresJSDialect } from 'kysely-postgres-js'
import postgres from 'postgres'
import { Logger } from '@summerfi/abstractions'
import { getUpdateLockService, UpdateLockService } from './services'

export interface PgRaysDbConfig {
  connectionString: string
  logger: Logger
}

export interface RaysDB {
  db: Kysely<Database>
  services: {
    updateLockService: UpdateLockService
  }
}

export * from './database-types'
export * from './services'

export const getRaysDB = async (config: PgRaysDbConfig): Promise<RaysDB> => {
  const pg = postgres(config.connectionString)
  const db = new Kysely<Database>({
    dialect: new PostgresJSDialect({
      postgres: pg,
    }),
    plugins: [new CamelCasePlugin()],
  })
  const updateLockService = getUpdateLockService({ db, logger: config.logger })

  return {
    db,
    services: {
      updateLockService,
    },
  }
}
