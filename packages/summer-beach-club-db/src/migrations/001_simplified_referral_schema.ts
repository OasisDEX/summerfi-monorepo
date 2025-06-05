import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  // 1. Create referral_codes table (simplified - no more totals)
  await db.schema
    .createTable('referral_codes')
    .ifNotExists()
    .addColumn('id', 'varchar(100)', (col) => col.primaryKey())
    .addColumn('custom_code', 'varchar(100)', (col) => col.unique())
    .addColumn('type', 'varchar(100)', (col) => col.notNull())
    .addColumn('active_users_count', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('total_deposits_referred_usd', sql`decimal(30,18)`, (col) =>
      col.notNull().defaultTo(0),
    )
    // Tracking
    .addColumn('last_calculated_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`NOW()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`NOW()`))
    .execute()

  // 2. Create users table (simplified)
  await db.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'varchar(100)', (col) => col.primaryKey())
    .addColumn('referrer_id', 'varchar(100)', (col) =>
      col.references('referral_codes.id').onDelete('set null'),
    )
    .addColumn('referral_code', 'varchar(100)', (col) =>
      col.references('referral_codes.id').onDelete('set null'),
    )
    .addColumn('referral_chain', 'varchar(20)')
    .addColumn('referral_timestamp', 'timestamptz')
    .addColumn('is_active', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('last_activity_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`NOW()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`NOW()`))
    .execute()

  // 3. Create rewards_balances table (new normalized table)
  await db.schema
    .createTable('rewards_balances')
    .ifNotExists()
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('referral_code_id', 'varchar(100)', (col) =>
      col.notNull().references('referral_codes.id').onDelete('cascade'),
    )
    .addColumn('currency', 'varchar(50)', (col) => col.notNull()) // 'points', 'summer', 'USDC', 'WETH', etc.
    .addColumn('balance', sql`decimal(30,18)`, (col) => col.notNull().defaultTo(0))
    .addColumn('balance_usd', sql`decimal(30,18)`, (col) => col.defaultTo(0)) // null for points/summer
    .addColumn('amount_per_day', sql`decimal(30,18)`, (col) => col.notNull().defaultTo(0)) // in asset terms
    .addColumn('amount_per_day_usd', sql`decimal(30,18)`, (col) => col.defaultTo(0)) // USD equivalent
    .addColumn('total_earned', sql`decimal(30,18)`, (col) => col.notNull().defaultTo(0))
    .addColumn('total_claimed', sql`decimal(30,18)`, (col) => col.notNull().defaultTo(0))
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`NOW()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`NOW()`))
    .addUniqueConstraint('rewards_balances_referral_code_currency_unique', [
      'referral_code_id',
      'currency',
    ])
    .execute()

  // 4. Create positions table (current state only - no snapshots!)
  await db.schema
    .createTable('positions')
    .ifNotExists()
    .addColumn('id', 'varchar(100)', (col) => col.notNull())
    .addColumn('chain', 'varchar(20)', (col) => col.notNull())
    .addColumn('user_id', 'varchar(100)', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('current_deposit_usd', sql`decimal(30,18)`, (col) => col.notNull().defaultTo(0))
    .addColumn('current_deposit_asset', sql`decimal(30,18)`, (col) => col.notNull().defaultTo(0))
    .addColumn('currency_symbol', 'varchar(20)', (col) => col.notNull().defaultTo('USD'))
    .addColumn('fees_per_day_referrer', sql`decimal(30,18)`, (col) => col.notNull().defaultTo(0))
    .addColumn('fees_per_day_owner', sql`decimal(30,18)`, (col) => col.notNull().defaultTo(0))
    .addColumn('fees_per_day_referrer_usd', sql`decimal(30,18)`, (col) =>
      col.notNull().defaultTo(0),
    )
    .addColumn('fees_per_day_owner_usd', sql`decimal(30,18)`, (col) => col.notNull().defaultTo(0))
    .addColumn('is_volatile', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('last_synced_at', 'timestamptz')
    .addPrimaryKeyConstraint('positions_pkey', ['id', 'chain'])
    .execute()

  // 5. Create processing checkpoint table
  await db.schema
    .createTable('processing_checkpoint')
    .ifNotExists()
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('last_processed_timestamp', 'timestamptz', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`NOW()`))
    .execute()

  // 6. Create daily stats table (optional, for historical tracking)
  await db.schema
    .createTable('daily_stats')
    .ifNotExists()
    .addColumn('referral_id', 'varchar(100)', (col) =>
      col.notNull().references('referral_codes.id').onDelete('cascade'),
    )
    .addColumn('date', 'date', (col) => col.notNull())
    .addColumn('points_earned', sql`decimal(30,18)`, (col) => col.notNull().defaultTo(0))
    .addColumn('active_users', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('total_deposits', sql`decimal(30,18)`, (col) => col.notNull().defaultTo(0))
    .addPrimaryKeyConstraint('daily_stats_pkey', ['referral_id', 'date'])
    .execute()

  // 7. Create points_config table for configuration
  await db.schema
    .createTable('points_config')
    .ifNotExists()
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('key', 'varchar(100)', (col) => col.notNull().unique())
    .addColumn('value', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`NOW()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`NOW()`))
    .execute()

  // 8. Create points distribution table
  await db.schema
    .createTable('rewards_distributions')
    .ifNotExists()
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('batch_id', 'varchar(100)', (col) => col.notNull())
    .addColumn('referral_code_id', 'varchar(100)', (col) =>
      col.notNull().references('referral_codes.id').onDelete('cascade'),
    )
    .addColumn('currency', 'varchar(50)', (col) => col.notNull())
    .addColumn('amount', sql`decimal(30,18)`, (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('distribution_timestamp', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`NOW()`),
    )
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`NOW()`))
    .execute()

  // Add indexes for rewards_distributions
  await db.schema
    .createIndex('idx_rewards_distributions_referral_code_id')
    .ifNotExists()
    .on('rewards_distributions')
    .column('referral_code_id')
    .execute()

  await db.schema
    .createIndex('idx_rewards_distributions_currency')
    .ifNotExists()
    .on('rewards_distributions')
    .column('currency')
    .execute()

  await db.schema
    .createIndex('idx_rewards_distributions_timestamp')
    .ifNotExists()
    .on('rewards_distributions')
    .column('distribution_timestamp')
    .execute()

  await db.schema
    .createIndex('idx_rewards_distributions_batch_id')
    .ifNotExists()
    .on('rewards_distributions')
    .column('batch_id')
    .execute()

  // Add indexes for rewards_balances
  await db.schema
    .createIndex('idx_rewards_balances_referral_code_id')
    .ifNotExists()
    .on('rewards_balances')
    .column('referral_code_id')
    .execute()

  await db.schema
    .createIndex('idx_rewards_balances_currency')
    .ifNotExists()
    .on('rewards_balances')
    .column('currency')
    .execute()

  await db.schema
    .createIndex('idx_rewards_balances_referral_code_currency')
    .ifNotExists()
    .on('rewards_balances')
    .columns(['referral_code_id', 'currency'])
    .execute()

  // Create triggers to update updated_at columns
  await db.executeQuery(
    sql`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql';
  `.compile(db),
  )

  // Create sequence for referral codes starting from 110
  await db.executeQuery(
    sql`
    CREATE SEQUENCE IF NOT EXISTS referral_codes_seq START 2000000;
  `.compile(db),
  )

  // Create trigger function to auto-generate referral codes for new users
  await db.executeQuery(
    sql`
    CREATE OR REPLACE FUNCTION auto_create_referral_code()
    RETURNS TRIGGER AS $$
    DECLARE
        new_code_id TEXT;
    BEGIN
        -- Generate new referral code ID
        new_code_id := nextval('referral_codes_seq')::text;
        
        -- Create a referral code for the new user
        INSERT INTO referral_codes (id, type)
        VALUES (new_code_id, 'user')
        ON CONFLICT (id) DO NOTHING;
        
        -- Set the user's referral_code to their own code
        NEW.referral_code = new_code_id;
        
        RETURN NEW;
    END;
    $$ language 'plpgsql';
  `.compile(db),
  )

  // Apply trigger to auto-create referral codes for new users
  await db.executeQuery(
    sql`
    CREATE TRIGGER auto_create_user_referral_code 
    BEFORE INSERT ON users
    FOR EACH ROW 
    WHEN (NEW.referral_code IS NULL)
    EXECUTE FUNCTION auto_create_referral_code();
  `.compile(db),
  )

  // Apply triggers to tables with updated_at
  const tablesWithUpdatedAt = ['referral_codes', 'users', 'points_config', 'rewards_balances']
  for (const table of tablesWithUpdatedAt) {
    await db.executeQuery(
      sql`
      CREATE TRIGGER update_${sql.raw(table)}_updated_at BEFORE UPDATE ON ${sql.raw(table)}
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `.compile(db),
    )
  }

  // Create indexes for performance
  await createSimplifiedIndexes(db)

  // Insert default configuration
  await db
    .insertInto('points_config')
    .values([
      {
        key: 'processing_interval_hours',
        value: '1',
        description: 'How often points processing runs (in hours)',
      },
      {
        key: 'active_user_threshold_usd',
        value: '100',
        description: 'Minimum USD deposit amount to consider user active',
      },
      {
        key: 'points_formula_base',
        value: '0.00005',
        description: 'Base multiplier in points formula',
      },
      {
        key: 'points_formula_log_multiplier',
        value: '0.0005',
        description: 'Logarithmic multiplier in points formula',
      },
      {
        key: 'run_migrations',
        value: 'false',
        description: 'Whether to run migrations',
      },
      {
        key: 'is_updating',
        value: 'false',
        description: 'Whether the system is currently processing data',
      },
    ])
    .onConflict((oc) => oc.column('key').doNothing())
    .execute()
}

async function createSimplifiedIndexes(db: Kysely<never>): Promise<void> {
  // Referral codes indexes
  await db.schema
    .createIndex('idx_referral_codes_custom_code')
    .ifNotExists()
    .on('referral_codes')
    .column('custom_code')
    .execute()

  await db.schema
    .createIndex('idx_referral_codes_active_users_count')
    .ifNotExists()
    .on('referral_codes')
    .column('active_users_count')
    .execute()

  // Users indexes
  await db.schema
    .createIndex('idx_users_referrer_id')
    .ifNotExists()
    .on('users')
    .column('referrer_id')
    .execute()

  await db.schema
    .createIndex('idx_users_referral_code')
    .ifNotExists()
    .on('users')
    .column('referral_code')
    .execute()

  await db.schema
    .createIndex('idx_users_referral_code_is_active')
    .ifNotExists()
    .on('users')
    .columns(['referral_code', 'is_active'])
    .execute()

  await db.schema
    .createIndex('idx_users_referrer_id_is_active')
    .ifNotExists()
    .on('users')
    .columns(['referrer_id', 'is_active'])
    .execute()

  await db.schema
    .createIndex('idx_users_is_active')
    .ifNotExists()
    .on('users')
    .column('is_active')
    .execute()

  // Positions indexes
  await db.schema
    .createIndex('idx_positions_user_id')
    .ifNotExists()
    .on('positions')
    .column('user_id')
    .execute()

  await db.schema
    .createIndex('idx_positions_chain')
    .ifNotExists()
    .on('positions')
    .column('chain')
    .execute()

  await db.schema
    .createIndex('idx_positions_currency_symbol')
    .ifNotExists()
    .on('positions')
    .column('currency_symbol')
    .execute()

  // Processing checkpoint index
  await db.schema
    .createIndex('idx_processing_checkpoint_timestamp')
    .ifNotExists()
    .on('processing_checkpoint')
    .column('last_processed_timestamp')
    .execute()

  // Daily stats indexes
  await db.schema
    .createIndex('idx_daily_stats_referral_id')
    .ifNotExists()
    .on('daily_stats')
    .column('referral_id')
    .execute()

  await db.schema
    .createIndex('idx_daily_stats_date')
    .ifNotExists()
    .on('daily_stats')
    .column('date')
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  // Drop tables in reverse order of dependencies
  await db.schema.dropTable('rewards_distributions').ifExists().execute()
  await db.schema.dropTable('daily_stats').ifExists().execute()
  await db.schema.dropTable('processing_checkpoint').ifExists().execute()
  await db.schema.dropTable('positions').ifExists().execute()
  await db.schema.dropTable('rewards_balances').ifExists().execute()
  await db.schema.dropTable('points_config').ifExists().execute()
  await db.schema.dropTable('users').ifExists().execute()
  await db.schema.dropTable('referral_codes').ifExists().execute()

  // Drop sequences
  await db.executeQuery(sql`DROP SEQUENCE IF EXISTS referral_codes_seq CASCADE;`.compile(db))

  // Drop the trigger functions
  await db.executeQuery(
    sql`DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;`.compile(db),
  )
  await db.executeQuery(
    sql`DROP FUNCTION IF EXISTS auto_create_referral_code() CASCADE;`.compile(db),
  )
  // drop sequences
  await db.executeQuery(sql`DROP SEQUENCE IF EXISTS referral_codes_seq CASCADE;`.compile(db))
}
