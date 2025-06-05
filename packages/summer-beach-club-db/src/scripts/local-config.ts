import process from 'node:process'
import { promises as fs } from 'node:fs'

import { FileMigrationProvider, Kysely, Migrator, PostgresDialect } from 'kysely'
import { Pool } from 'pg'

import * as dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({ path: path.join(__dirname, '../../.env') })

export function getDatabaseConfig() {
  console.log('Retrieving database connection string from environment variables...')
  const { BEACH_CLUB_REWARDS_DB_CONNECTION_STRING } = process.env
  if (!BEACH_CLUB_REWARDS_DB_CONNECTION_STRING) {
    console.error('BEACH_CLUB_REWARDS_DB_CONNECTION_STRING is not set')
    throw new Error('BEACH_CLUB_REWARDS_DB_CONNECTION_STRING is not set')
  }

  return BEACH_CLUB_REWARDS_DB_CONNECTION_STRING
}

export function createDatabase() {
  const connectionString = getDatabaseConfig()

  console.log('Creating database pool...')
  const pool = new Pool({ connectionString })

  console.log('Initializing Kysely database instance...')
  const db = new Kysely<any>({
    dialect: new PostgresDialect({ pool }),
  })

  return { db, pool }
}

export function createMigrator(db: Kysely<any>) {
  console.log('Setting up migrator...')
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, '../migrations'),
    }),
    // Use the custom table name that was created by KyselyMigrator
    migrationTableName: 'migrations',
  })
  console.log('Migrator setup complete.')

  return migrator
}

export async function closeDatabase(db: Kysely<any>, pool: Pool) {
  await db.destroy()
  // Note: db.destroy() already closes the underlying pool, no need to call pool.end()
  console.log('Database connections closed.')
}
