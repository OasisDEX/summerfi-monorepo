import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  // Create network enum
  await sql`CREATE TYPE network AS ENUM ('arbitrum', 'optimism', 'base', 'mainnet')`.execute(db)

  // Create tokens table
  await db.schema
    .createTable('token')
    .addColumn('address', 'varchar(66)', (col) => col.primaryKey())
    .addColumn('symbol', 'varchar', (col) => col.notNull())
    .addColumn('decimals', 'integer', (col) => col.notNull())
    .addColumn('precision', 'text', (col) => col.notNull())
    .addColumn('network', sql`network`, (col) => col.notNull())
    .execute()

  // Create reward_rate table first
  await db.schema
    .createTable('reward_rate')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('reward_token', 'varchar(66)', (col) => col.notNull().references('token.address'))
    .addColumn('rate', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('network', sql`network`, (col) => col.notNull())
    .addColumn('product_id', 'varchar', (col) => col.notNull())
    .addColumn('timestamp', 'bigint', (col) => col.notNull())
    .execute()

  // Create networks table with lock mechanism
  await db.schema
    .createTable('network_status')
    .addColumn('network', sql`network`, (col) => col.primaryKey())
    .addColumn('is_updating', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('last_updated_at', 'bigint', (col) => col.notNull())
    .addColumn('last_block_number', 'bigint', (col) => col.notNull())
    .execute()

  // Insert default networks
  await db.insertInto('network_status')
    .values([
      { network: 'arbitrum', is_updating: false, last_updated_at: 0, last_block_number: 0 },
      { network: 'optimism', is_updating: false, last_updated_at: 0, last_block_number: 0 },
      { network: 'base', is_updating: false, last_updated_at: 0, last_block_number: 0 },
      { network: 'mainnet', is_updating: false, last_updated_at: 0, last_block_number: 0 },
    ])
    .execute()

  // After reward_rate table creation
  await db.schema
    .createTable('daily_reward_rate')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('date', 'bigint', (col) => col.notNull())
    .addColumn('sum_rates', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('update_count', 'bigint', (col) => col.notNull())
    .addColumn('average_rate', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('protocol', 'varchar', (col) => col.notNull())
    .addColumn('network', sql`network`, (col) => col.notNull())
    .addColumn('product_id', 'varchar', (col) => col.notNull())
    .execute()

  // Similar tables for hourly and weekly reward rates
  await db.schema
    .createTable('hourly_reward_rate')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('date', 'bigint', (col) => col.notNull())
    .addColumn('sum_rates', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('update_count', 'bigint', (col) => col.notNull())
    .addColumn('average_rate', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('protocol', 'varchar', (col) => col.notNull())
    .addColumn('network', sql`network`, (col) => col.notNull())
    .addColumn('product_id', 'varchar', (col) => col.notNull())
    .execute()

  await db.schema
    .createTable('weekly_reward_rate')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('week_timestamp', 'bigint', (col) => col.notNull())
    .addColumn('sum_rates', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('update_count', 'bigint', (col) => col.notNull())
    .addColumn('average_rate', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('protocol', 'varchar', (col) => col.notNull())
    .addColumn('network', sql`network`, (col) => col.notNull())
    .addColumn('product_id', 'varchar', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.dropTable('reward_rate').execute()
  await db.schema.dropTable('daily_reward_rate').execute()
  await db.schema.dropTable('hourly_reward_rate').execute()
  await db.schema.dropTable('weekly_reward_rate').execute()
  await db.schema.dropTable('network_status').execute()
  await db.schema.dropTable('token').execute()
  await sql`DROP TYPE network`.execute(db)
}
