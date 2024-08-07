import process from 'node:process'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { FileMigrationProvider, Kysely, Migrator } from 'kysely'
import { PostgresJSDialect } from 'kysely-postgres-js'
import postgres from 'postgres'

export function getMigrator() {
  const { EARN_PROTOCOL_DB_CONNECTION_STRING } = process.env
  if (!EARN_PROTOCOL_DB_CONNECTION_STRING) {
    throw new Error('EARN_PROTOCOL_DB_CONNECTION_STRING is not set')
  }
  const dialect = new PostgresJSDialect({
    postgres: postgres(EARN_PROTOCOL_DB_CONNECTION_STRING),
  })

  const db = new Kysely<unknown>({
    dialect: dialect,
  })

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, '../migrations'),
    }),
  })

  return { migrator, db }
}
