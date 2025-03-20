import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  await db.schema
    .createTable('rebalance_activity')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('rebalance_id', 'varchar(255)', (col) => col.notNull())
    .addColumn('amount', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('amount_usd', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('vault_id', 'varchar(66)', (col) => col.notNull())
    .addColumn('vault_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('strategy', 'varchar(66)', (col) => col.notNull())
    .addColumn('strategy_id', 'varchar(255)', (col) => col.notNull())
    .addColumn('from_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('from_deposit_limit', 'decimal(98, 18)', (col) => col.notNull())
    .addColumn('from_total_value_locked_usd', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('to_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('to_deposit_limit', 'decimal(98, 18)', (col) => col.notNull())
    .addColumn('to_total_value_locked_usd', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('network', sql`network`, (col) => col.notNull())
    .addColumn('action_type', 'varchar(255)', (col) => col.notNull())
    .addColumn('input_token_price_usd', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('input_token_symbol', 'varchar(66)', (col) => col.notNull())
    .addColumn('input_token_decimals', 'bigint', (col) => col.notNull())
    .addColumn('tx_hash', 'varchar(66)', (col) => col.notNull())
    .addColumn('timestamp', 'bigint', (col) => col.notNull())
    .addUniqueConstraint('rebalance_activity_rebalance_id_network_timestamp_unique', [
      'rebalance_id',
      'network',
      'timestamp',
    ])
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.dropTable('rebalance_activity').execute()
}
