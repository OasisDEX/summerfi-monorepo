import { Kysely, PostgresDialect, sql } from 'kysely'
import { Pool } from 'pg'

export interface Migration {
  name: string
  up: (db: Kysely<any>) => Promise<void>
  down: (db: Kysely<any>) => Promise<void>
}

export class KyselyMigrator {
  private db: Kysely<any>
  private pool: Pool

  constructor(pool: Pool) {
    this.pool = pool
    this.db = new Kysely<any>({
      dialect: new PostgresDialect({
        pool: this.pool,
      }),
    })
  }

  async runMigrations(): Promise<void> {
    console.log('Starting Kysely database migrations...')

    // Ensure migrations table exists
    await this.ensureMigrationsTable()

    // Get all migrations
    const migrations = this.getMigrations()

    // Get already applied migrations
    const appliedMigrations = await this.getAppliedMigrations()

    // Apply pending migrations
    for (const migration of migrations) {
      if (!appliedMigrations.includes(migration.name)) {
        await this.applyMigration(migration)
      } else {
        console.log(`Migration ${migration.name} already applied, skipping`)
      }
    }

    console.log('Kysely database migrations completed')
  }

  async rollbackMigrations(): Promise<void> {
    console.log('Rolling back all migrations...')

    // Get applied migrations in reverse order
    const appliedMigrations = await this.getAppliedMigrations()
    const migrations = this.getMigrations()

    for (let i = appliedMigrations.length - 1; i >= 0; i--) {
      const migrationName = appliedMigrations[i]
      const migration = migrations.find((m) => m.name === migrationName)

      if (migration) {
        await this.rollbackMigration(migration)
      }
    }

    console.log('All migrations rolled back')
  }

  private async ensureMigrationsTable(): Promise<void> {
    await this.db.schema
      .createTable('migrations')
      .ifNotExists()
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('filename', 'varchar(255)', (col) => col.notNull().unique())
      .addColumn('applied_at', 'timestamptz', (col) => col.defaultTo(sql`NOW()`))
      .execute()
  }

  private async getAppliedMigrations(): Promise<string[]> {
    try {
      const result = await this.db
        .selectFrom('migrations')
        .select('filename')
        .orderBy('applied_at')
        .execute()

      return result.map((row) => row.filename)
    } catch (error) {
      // If migrations table doesn't exist yet, return empty array
      return []
    }
  }

  private async applyMigration(migration: Migration): Promise<void> {
    console.log(`Applying migration: ${migration.name}`)

    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')

      // Execute the migration
      await migration.up(this.db)

      // Record the migration as applied
      await this.db.insertInto('migrations').values({ filename: migration.name }).execute()

      await client.query('COMMIT')
      console.log(`Migration ${migration.name} applied successfully`)
    } catch (error) {
      await client.query('ROLLBACK')
      console.error(`Error applying migration ${migration.name}:`, error)
      throw error
    } finally {
      client.release()
    }
  }

  private async rollbackMigration(migration: Migration): Promise<void> {
    console.log(`Rolling back migration: ${migration.name}`)

    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')

      // Execute the rollback
      await migration.down(this.db)

      // Remove the migration record
      await this.db.deleteFrom('migrations').where('filename', '=', migration.name).execute()

      await client.query('COMMIT')
      console.log(`Migration ${migration.name} rolled back successfully`)
    } catch (error) {
      await client.query('ROLLBACK')
      console.error(`Error rolling back migration ${migration.name}:`, error)
      throw error
    } finally {
      client.release()
    }
  }

  private getMigrations(): Migration[] {
    return [
      {
        name: '001_simplified_referral_schema',
        up: this.migration001SimplifiedUp.bind(this),
        down: this.migration001SimplifiedDown.bind(this),
      },
    ]
  }

  // Simplified schema migration
  private async migration001SimplifiedUp(db: Kysely<any>): Promise<void> {
    // 1. Create referral_codes table (aggregated stats)
    await db.schema
      .createTable('referral_codes')
      .ifNotExists()
      .addColumn('id', 'varchar(100)', (col) => col.primaryKey())
      .addColumn('custom_code', 'varchar(100)', (col) => col.unique())
      .addColumn('type', 'varchar(100)', (col) => col.notNull())
      // Running totals
      .addColumn('total_points_earned', sql`decimal(20,8)`, (col) => col.notNull().defaultTo(0))
      .addColumn('total_summer_earned', sql`decimal(20,8)`, (col) => col.notNull().defaultTo(0))
      .addColumn('total_fees_earned', sql`decimal(20,8)`, (col) => col.notNull().defaultTo(0))
      .addColumn('total_summer_claimed', sql`decimal(20,8)`, (col) => col.notNull().defaultTo(0))
      .addColumn('total_fees_claimed', sql`decimal(20,8)`, (col) => col.notNull().defaultTo(0))
      .addColumn('total_points_claimed', sql`decimal(20,8)`, (col) => col.notNull().defaultTo(0))
      .addColumn('active_users_count', 'integer', (col) => col.notNull().defaultTo(0))
      .addColumn('total_deposits_usd', sql`decimal(20,8)`, (col) => col.notNull().defaultTo(0))
      // Daily rates for frontend
      .addColumn('points_per_day', sql`decimal(20,8)`, (col) => col.notNull().defaultTo(0))
      .addColumn('fees_per_day', sql`decimal(20,8)`, (col) => col.notNull().defaultTo(0))
      .addColumn('summer_per_day', sql`decimal(20,8)`, (col) => col.notNull().defaultTo(0))
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

    // 3. Create positions table (current state only - no snapshots!)
    await db.schema
      .createTable('positions')
      .ifNotExists()
      .addColumn('id', 'varchar(100)', (col) => col.notNull())
      .addColumn('chain', 'varchar(20)', (col) => col.notNull())
      .addColumn('user_id', 'varchar(100)', (col) =>
        col.notNull().references('users.id').onDelete('cascade'),
      )
      .addColumn('current_deposit_usd', sql`decimal(20,8)`, (col) => col.notNull().defaultTo(0))
      .addColumn('fees_per_day_referrer', sql`decimal(20,8)`, (col) => col.notNull().defaultTo(0))
      .addColumn('fees_per_day_owner', sql`decimal(20,8)`, (col) => col.notNull().defaultTo(0))
      .addColumn('is_volatile', 'boolean', (col) => col.notNull().defaultTo(false))
      .addColumn('last_synced_at', 'timestamptz')
      .addPrimaryKeyConstraint('positions_pkey', ['id', 'chain'])
      .execute()

    // 4. Create processing checkpoint table
    await db.schema
      .createTable('processing_checkpoint')
      .ifNotExists()
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('last_processed_timestamp', 'timestamptz', (col) => col.notNull())
      .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`NOW()`))
      .execute()

    // 5. Create daily stats table (optional, for historical tracking)
    await db.schema
      .createTable('daily_stats')
      .ifNotExists()
      .addColumn('referral_id', 'varchar(100)', (col) =>
        col.notNull().references('referral_codes.id').onDelete('cascade'),
      )
      .addColumn('date', 'date', (col) => col.notNull())
      .addColumn('points_earned', sql`decimal(20,8)`, (col) => col.notNull().defaultTo(0))
      .addColumn('active_users', 'integer', (col) => col.notNull().defaultTo(0))
      .addColumn('total_deposits', sql`decimal(20,8)`, (col) => col.notNull().defaultTo(0))
      .addPrimaryKeyConstraint('daily_stats_pkey', ['referral_id', 'date'])
      .execute()

    // 6. Create points_config table for configuration
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

    // 7. Create points distribution table
    await db.schema
      .createTable('rewards_distributions')
      .ifNotExists()
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('referral_id', 'varchar(100)', (col) =>
        col.notNull().references('referral_codes.id').onDelete('cascade'),
      )
      .addColumn('amount', sql`decimal(20,8)`, (col) => col.notNull())
      .addColumn('type', 'varchar(100)', (col) => col.notNull())
      .addColumn('description', 'text', (col) => col.notNull())
      .addColumn('distribution_timestamp', 'timestamptz', (col) =>
        col.notNull().defaultTo(sql`NOW()`),
      )
      .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`NOW()`))
      .execute()

    // Add index for rewards_distributions
    await db.schema
      .createIndex('idx_points_distributions_referral_id')
      .ifNotExists()
      .on('rewards_distributions')
      .column('referral_id')
      .execute()

    await db.schema
      .createIndex('idx_points_distributions_timestamp')
      .ifNotExists()
      .on('rewards_distributions')
      .column('distribution_timestamp')
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
    const tablesWithUpdatedAt = ['referral_codes', 'users', 'points_config']
    for (const table of tablesWithUpdatedAt) {
      await db.executeQuery(
        sql`
        CREATE TRIGGER update_${sql.raw(table)}_updated_at BEFORE UPDATE ON ${sql.raw(table)}
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `.compile(db),
      )
    }

    // Create indexes for performance
    await this.createSimplifiedIndexes(db)

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
          value: '0.1',
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
          key: 'enable_backfill',
          value: 'true',
          description: 'Enable backfill for historical data',
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

  private async createSimplifiedIndexes(db: Kysely<any>): Promise<void> {
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

  private async migration001SimplifiedDown(db: Kysely<any>): Promise<void> {
    // Drop tables in reverse order of dependencies
    await db.schema.dropTable('rewards_distributions').ifExists().execute()
    await db.schema.dropTable('daily_stats').ifExists().execute()
    await db.schema.dropTable('processing_checkpoint').ifExists().execute()
    await db.schema.dropTable('positions').ifExists().execute()
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
  }

  async reset(): Promise<void> {
    console.log('🧹 Resetting database - dropping all tables...')

    const client = await this.pool.connect()
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

      // drop functions
      await client.query('DROP FUNCTION IF EXISTS auto_create_referral_code() CASCADE')
      await client.query('DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE')

      // drop triggers
      await client.query('DROP TRIGGER IF EXISTS auto_create_user_referral_code ON users')
      await client.query(
        'DROP TRIGGER IF EXISTS update_referral_codes_updated_at ON referral_codes',
      )
      await client.query('DROP TRIGGER IF EXISTS update_users_updated_at ON users')
      await client.query('DROP TRIGGER IF EXISTS update_points_config_updated_at ON points_config')

      await client.query('COMMIT')
      console.log('✅ Database reset completed')
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('❌ Error resetting database:', error)
      throw error
    } finally {
      client.release()
    }
  }

  async close(): Promise<void> {
    await this.db.destroy()
  }
}
