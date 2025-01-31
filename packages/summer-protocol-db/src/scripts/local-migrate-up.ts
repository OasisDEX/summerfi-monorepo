import * as console from 'node:console'
import * as process from 'node:process'
import { getMigrator } from './local-config'
import { generateTypes } from './generate-types'

import * as dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({ path: path.join(__dirname, '../../.env') })

async function migrateUp() {
  console.info('Starting migration process...')

  const { migrator, db } = getMigrator()
  console.debug('Migrator and database instance retrieved.')

  console.info(`Trying to migrate up`)
  const { error, results } = await migrator.migrateUp()
  console.debug('Migration results received:', results)

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

  console.info('Generating types from DB')
  await generateTypes(db)
  console.info('Types generated')

  await db.destroy()
  console.info('Database connection closed.')
}

migrateUp()
  .then(() => {
    console.log('migrated successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  })
