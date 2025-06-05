import * as console from 'node:console'
import * as process from 'node:process'
import { createDatabase, closeDatabase } from './local-config'
import * as dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({ path: path.join(__dirname, '../../.env') })

async function resetDatabase() {
  console.info('🧹 Starting database reset - dropping all tables...')

  const { db, pool } = createDatabase()

  try {
    // Get a client from the pool for transaction handling
    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      // Drop all tables (order matters due to foreign keys)
      const tablesToDrop = [
        'user_activity_status',
        'point_distributions',
        'position_snapshots',
        'rewards_distributions',
        'points_distributions',
        'positions',
        'rewards_balances',
        'points_config',
        'referral_points',
        'custom_referral_codes',
        'processing_checkpoint',
        'users',
        'referral_codes',
        'migrations',
        'daily_stats',
      ]

      for (const table of tablesToDrop) {
        await client.query(`DROP TABLE IF EXISTS ${table} CASCADE`)
        console.log(`Dropped table: ${table}`)
      }

      // Drop functions
      await client.query('DROP FUNCTION IF EXISTS auto_create_referral_code() CASCADE')
      await client.query('DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE')

      // Drop triggers
      await client.query('DROP TRIGGER IF EXISTS auto_create_user_referral_code ON users')
      await client.query(
        'DROP TRIGGER IF EXISTS update_referral_codes_updated_at ON referral_codes',
      )
      await client.query('DROP TRIGGER IF EXISTS update_users_updated_at ON users')
      await client.query('DROP TRIGGER IF EXISTS update_points_config_updated_at ON points_config')
      await client.query(
        'DROP TRIGGER IF EXISTS update_rewards_balances_updated_at ON rewards_balances',
      )

      // Drop sequences
      await client.query('DROP SEQUENCE IF EXISTS referral_codes_seq CASCADE')

      await client.query('COMMIT')
      console.log('✅ Database reset completed successfully')
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('❌ Error resetting database:', error)
      throw error
    } finally {
      client.release()
    }

    console.log('Database reset completed successfully')
    console.info('💡 Run "pnpm codegen:kysely" to generate updated types')
  } catch (error) {
    console.error('Database reset failed:', error)
    throw error
  } finally {
    await closeDatabase(db, pool)
  }
}

resetDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Database reset failed:', error)
    process.exit(1)
  })
