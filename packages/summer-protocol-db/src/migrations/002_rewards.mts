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
    .addColumn('precision', 'integer', (col) => col.notNull())
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

  // Create base rate tables
  await db.schema
    .createTable('daily_interest_rate')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('date', 'bigint', (col) => col.notNull())
    .addColumn('sum_rates', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('update_count', 'bigint', (col) => col.notNull())
    .addColumn('average_rate', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('native_rate', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('rewards_rate', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('protocol', 'varchar', (col) => col.notNull())
    .addColumn('network', sql`network`, (col) => col.notNull())
    .addColumn('token', 'varchar(66)', (col) => col.notNull().references('token.address'))
    .addColumn('product_id', 'varchar', (col) => col.notNull())
    .execute()

  await db.schema
    .createTable('hourly_interest_rate')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('date', 'bigint', (col) => col.notNull())
    .addColumn('sum_rates', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('update_count', 'bigint', (col) => col.notNull())
    .addColumn('average_rate', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('native_rate', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('rewards_rate', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('protocol', 'varchar', (col) => col.notNull())
    .addColumn('network', sql`network`, (col) => col.notNull())
    .addColumn('token', 'varchar(66)', (col) => col.notNull().references('token.address'))
    .addColumn('product_id', 'varchar', (col) => col.notNull())
    .execute()

  await db.schema
    .createTable('weekly_interest_rate')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('week_timestamp', 'bigint', (col) => col.notNull())
    .addColumn('sum_rates', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('update_count', 'bigint', (col) => col.notNull())
    .addColumn('average_rate', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('native_rate', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('rewards_rate', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('protocol', 'varchar', (col) => col.notNull())
    .addColumn('network', sql`network`, (col) => col.notNull())
    .addColumn('token', 'varchar(66)', (col) => col.notNull().references('token.address'))
    .addColumn('product_id', 'varchar', (col) => col.notNull())
    .execute()

  // Create interest_rate table
  await db.schema
    .createTable('interest_rate')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('type', 'varchar', (col) => col.notNull())
    .addColumn('rate', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('native_rate', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('rewards_rate', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('block_number', 'bigint', (col) => col.notNull())
    .addColumn('timestamp', 'bigint', (col) => col.notNull())
    .addColumn('protocol', 'varchar', (col) => col.notNull())
    .addColumn('network', sql`network`, (col) => col.notNull())
    .addColumn('token', 'varchar(66)', (col) => col.notNull().references('token.address'))
    .addColumn('product_id', 'varchar', (col) => col.notNull())
    .addColumn('daily_rate_id', 'varchar', (col) => col.notNull().references('daily_interest_rate.id'))
    .addColumn('hourly_rate_id', 'varchar', (col) => col.notNull().references('hourly_interest_rate.id'))
    .addColumn('weekly_rate_id', 'varchar', (col) => col.notNull().references('weekly_interest_rate.id'))
    .execute()

  // Create junction table for interest_rate to reward_rate many-to-many relationship
  await db.schema
    .createTable('interest_rate_rewards')
    .addColumn('interest_rate_id', 'varchar', (col) => 
      col.notNull().references('interest_rate.id').onDelete('cascade'))
    .addColumn('reward_rate_id', 'varchar', (col) => 
      col.notNull().references('reward_rate.id').onDelete('cascade'))
    .addPrimaryKeyConstraint('interest_rate_rewards_pkey', ['interest_rate_id', 'reward_rate_id'])
    .execute()

  // Create a view that combines interest_rate with its rewards
  await sql`
    CREATE VIEW interest_rate_with_rewards AS
    SELECT 
      ir.*,
      ARRAY_AGG(
        json_build_object(
          'reward_rate_id', rr.id,
          'reward_token', rr.reward_token,
          'rate', rr.rate
        )
      ) as reward_rates
    FROM interest_rate ir
    LEFT JOIN interest_rate_rewards irr ON ir.id = irr.interest_rate_id
    LEFT JOIN reward_rate rr ON irr.reward_rate_id = rr.id
    GROUP BY ir.id
  `.execute(db)

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
  await sql`DROP VIEW IF EXISTS interest_rate_with_rewards`.execute(db)
  await db.schema.dropTable('interest_rate_rewards').execute()
  await db.schema.dropTable('interest_rate').execute()
  await db.schema.dropTable('reward_rate').execute()
  await db.schema.dropTable('daily_interest_rate').execute()
  await db.schema.dropTable('hourly_interest_rate').execute()
  await db.schema.dropTable('weekly_interest_rate').execute()
  await db.schema.dropTable('daily_reward_rate').execute()
  await db.schema.dropTable('hourly_reward_rate').execute()
  await db.schema.dropTable('weekly_reward_rate').execute()
  await db.schema.dropTable('network_status').execute()
  await db.schema.dropTable('token').execute()
  await sql`DROP TYPE network`.execute(db)
}
