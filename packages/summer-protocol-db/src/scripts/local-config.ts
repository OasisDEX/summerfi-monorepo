import process from 'node:process'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { FileMigrationProvider, Kysely, Migrator } from 'kysely'
import { PostgresJSDialect } from 'kysely-postgres-js'
import postgres from 'postgres'
import { PostgresDB } from 'kysely-codegen/dist/dialects/postgres/postgres-db'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function getMigrator() {
  console.log('Retrieving database connection string from environment variables...')
  const { EARN_PROTOCOL_DB_CONNECTION_STRING } = process.env
  if (!EARN_PROTOCOL_DB_CONNECTION_STRING) {
    console.error('EARN_PROTOCOL_DB_CONNECTION_STRING is not set')
    throw new Error('EARN_PROTOCOL_DB_CONNECTION_STRING is not set')
  }

  console.log('Creating Postgres dialect...')
  const dialect = new PostgresJSDialect({
    postgres: postgres(EARN_PROTOCOL_DB_CONNECTION_STRING),
  })
  console.log('Postgres dialect created.')

  console.log('Initializing Kysely database instance...')
  const db = new Kysely<PostgresDB>({
    dialect: dialect,
  })
  console.log('Kysely database instance initialized.')

  console.log('Setting up migrator...')
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, '../migrations'),
    }),
  })
  console.log('Migrator setup complete.')

  return { migrator, db }
}
