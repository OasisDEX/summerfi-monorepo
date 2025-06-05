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

      default:
        console.log(`
Usage: pnpm execute-simplified <command>

Commands:
  process    - Process latest referral points (default)

Examples:
  pnpm execute                    # Process latest
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
