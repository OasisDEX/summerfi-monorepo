import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  // Create fleet_interest_rate table
  await db.schema
    .createTable('fleet_interest_rate')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('fleet_address', 'varchar(66)', (col) => col.notNull())
    .addColumn('rate', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('network', sql`network`, (col) => col.notNull())
    .addColumn('timestamp', 'bigint', (col) => col.notNull())
    .execute()

  // Create daily_fleet_interest_rate table
  await db.schema
    .createTable('daily_fleet_interest_rate')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('fleet_address', 'varchar(66)', (col) => col.notNull())
    .addColumn('date', 'bigint', (col) => col.notNull())
    .addColumn('sum_rates', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('update_count', 'bigint', (col) => col.notNull())
    .addColumn('average_rate', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('network', sql`network`, (col) => col.notNull())
    .execute()

  // Create hourly_fleet_interest_rate table
  await db.schema
    .createTable('hourly_fleet_interest_rate')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('fleet_address', 'varchar(66)', (col) => col.notNull())
    .addColumn('date', 'bigint', (col) => col.notNull())
    .addColumn('sum_rates', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('update_count', 'bigint', (col) => col.notNull())
    .addColumn('average_rate', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('network', sql`network`, (col) => col.notNull())
    .execute()

  // Create weekly_fleet_interest_rate table
  await db.schema
    .createTable('weekly_fleet_interest_rate')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('fleet_address', 'varchar(66)', (col) => col.notNull())
    .addColumn('week_timestamp', 'bigint', (col) => col.notNull())
    .addColumn('sum_rates', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('update_count', 'bigint', (col) => col.notNull())
    .addColumn('average_rate', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('network', sql`network`, (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.dropTable('fleet_interest_rate').execute()
  await db.schema.dropTable('daily_fleet_interest_rate').execute()
  await db.schema.dropTable('hourly_fleet_interest_rate').execute()
  await db.schema.dropTable('weekly_fleet_interest_rate').execute()
} 