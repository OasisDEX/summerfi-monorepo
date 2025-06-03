#!/usr/bin/env node
import { DatabaseService } from 'src/db'

async function main() {
  const db = new DatabaseService()

  try {
    const command = process.argv[2]

    switch (command) {
      case 'reset':
        await db.resetMigrations()
        await db.migrate()
        break
      case 'up':
        await db.migrate()
        break
      case 'down':
        await db.rollbackMigrations()
        break
      default:
        await db.migrate()
        break
    }
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    await db.close()
  }
}

main()
