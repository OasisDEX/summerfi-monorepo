#!/usr/bin/env node

import { DatabaseService } from './db'
import { ReferralProcessor } from './processor'

async function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'process'

  const processor = new ReferralProcessor()
  const db = new DatabaseService()

  try {
    switch (command) {
      case 'process':
        console.log('🚀 Starting referral points processor (simplified)...')
        const result = await processor.processLatest()
        if (result.success) {
          console.log(`✅ Processing completed successfully`)
          console.log(`   Users processed: ${result.usersProcessed}`)
          console.log(`   Active users: ${result.activeUsers}`)
        } else {
          console.error('❌ Processing failed:', result.error)
          process.exit(1)
        }
        break

      case 'migrate':
        console.log('🔧 Running database migrations...')
        await db.migrate()
        console.log('✅ Migrations completed')
        break

      case 'reset':
        console.log('⚠️  WARNING: This will delete all data!')
        console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...')
        await new Promise((resolve) => setTimeout(resolve, 5000))

        const migrator = new (await import('./migrations/kysely-migrator')).KyselyMigrator(
          db.rawPool,
        )
        await migrator.reset()
        console.log('✅ Database reset completed')
        break

      default:
        console.log(`
Usage: pnpm execute-simplified <command>

Commands:
  process    - Process latest referral points (default)
  backfill   - Backfill historical data
  stats      - Show system statistics
  migrate    - Run database migrations
  reset      - Reset database (WARNING: deletes all data)

Examples:
  pnpm execute-simplified                    # Process latest
  pnpm execute-simplified backfill           # Backfill all history
  pnpm execute-simplified backfill 2024-01-01 # Backfill from specific date
  pnpm execute-simplified stats              # Show statistics
        `)
        process.exit(1)
    }
  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  } finally {
    await processor.close()
    await db.close()
  }
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Unhandled error:', error)
    process.exit(1)
  })
}
