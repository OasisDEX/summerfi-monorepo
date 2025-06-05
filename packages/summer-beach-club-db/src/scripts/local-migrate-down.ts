import * as console from 'node:console'
import * as process from 'node:process'
import { createDatabase, createMigrator, closeDatabase } from './local-config'
import * as dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({ path: path.join(__dirname, '../../.env') })

async function migrateDown() {
  console.info('Starting migration down process...')

  const { db, pool } = createDatabase()
  const migrator = createMigrator(db)

  try {
    console.info('Running migration down...')
    const { error, results } = await migrator.migrateDown()

    results?.forEach((it) => {
      if (it.status === 'Success') {
        console.log(`migration "${it.migrationName}" was executed successfully`)
      } else if (it.status === 'Error') {
        console.error(`failed to execute migration "${it.migrationName}"`)
      }
    })

    if (error) {
      console.error('failed to migrate')
      console.error(error)
      process.exit(1)
    }

    console.log('Migration down completed successfully')
    console.info('💡 Run "pnpm codegen:kysely" to generate updated types')
  } catch (error) {
    console.error('Migration down failed:', error)
    throw error
  } finally {
    await closeDatabase(db, pool)
  }
}

migrateDown()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration down failed:', error)
    process.exit(1)
  })
