import { DB as DBType } from './database-types'
import { Kysely, PostgresDialect } from 'kysely'
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
export type DB = DBType
export interface BeachClubDB {
  db: Kysely<DB>
}

export * from './database-types'


export const getBeachClubDb = (config: PgBeachClubDbConfig): BeachClubDB => {
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

  return {
    db,
  }
}
