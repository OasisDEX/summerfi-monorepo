import { Kysely, sql } from 'kysely'

/**
 * Offchain APR tables.
 *
 * Mirrors the reward_rate tables (002_rewards) but stores the *base* APR for
 * arks/products whose yield cannot be derived on-chain (e.g. institutional
 * RWAs with no oracle or price-per-share signal). The value is sourced from
 * an offchain provider by the `update-offchain-apr` background job.
 *
 * `source` records which provider supplied the rate and `as_of` records the
 * timestamp the provider reports the rate for (e.g. the NAV date), which can
 * lag the sampling `timestamp`.
 */
export async function up(db: Kysely<never>): Promise<void> {
  // Raw samples
  await db.schema
    .createTable('offchain_apr')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('product_id', 'varchar', (col) => col.notNull())
    .addColumn('protocol', 'varchar', (col) => col.notNull())
    .addColumn('rate', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('source', 'varchar', (col) => col.notNull())
    .addColumn('as_of', 'bigint', (col) => col.notNull())
    .addColumn('network', sql`network`, (col) => col.notNull())
    .addColumn('timestamp', 'bigint', (col) => col.notNull())
    .execute()

  await db.schema
    .createTable('hourly_offchain_apr')
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
    .createTable('daily_offchain_apr')
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
    .createTable('weekly_offchain_apr')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('week_timestamp', 'bigint', (col) => col.notNull())
    .addColumn('sum_rates', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('update_count', 'bigint', (col) => col.notNull())
    .addColumn('average_rate', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('protocol', 'varchar', (col) => col.notNull())
    .addColumn('network', sql`network`, (col) => col.notNull())
    .addColumn('product_id', 'varchar', (col) => col.notNull())
    .execute()

  // Lookups by (network, product_id) ordered by time are the hot path for
  // consumers reading the latest base rate per ark.
  await db.schema
    .createIndex('offchain_apr_network_product_timestamp_idx')
    .on('offchain_apr')
    .columns(['network', 'product_id', 'timestamp'])
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.dropTable('offchain_apr').execute()
  await db.schema.dropTable('hourly_offchain_apr').execute()
  await db.schema.dropTable('daily_offchain_apr').execute()
  await db.schema.dropTable('weekly_offchain_apr').execute()
}
