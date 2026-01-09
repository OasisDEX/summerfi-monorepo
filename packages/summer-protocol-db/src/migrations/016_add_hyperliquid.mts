import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  // Check if 'hyperliquid' value already exists in the enum
  const enumValues = await sql<{ enum_range: string[] }>`
    SELECT enum_range(NULL::network)
  `.execute(db)

  if (!enumValues.rows[0].enum_range.includes('hyperliquid')) {
    // Add 'hyperliquid' to the network enum in a separate transaction
    await sql`
      BEGIN;
      ALTER TYPE network ADD VALUE 'hyperliquid';
      COMMIT;
    `.execute(db)
  }

  // Now in a new transaction, add the network status
  await sql`
    INSERT INTO network_status (network, is_updating, last_updated_at, last_block_number)
    VALUES ('hyperliquid', false, 0, 0)
  `.execute(db)
}

export async function down(db: Kysely<never>): Promise<void> {
  // Remove hyperliquid network status using raw SQL
  await sql`
    DELETE FROM network_status 
    WHERE network = 'hyperliquid'
  `.execute(db)

  // Note: PostgreSQL doesn't support removing enum values directly
  // To remove the enum value, you would need to:
  // 1. Create a new enum without the value
  // 2. Update all tables to use the new enum
  // 3. Drop the old enum
  // This is complex and potentially risky, so we're not including it in the down migration
}
