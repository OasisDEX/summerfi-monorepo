import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  await db.schema
    .createTable('latest_activity')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_address', 'varchar(42)', (col) => col.notNull())
    .addColumn('vault_id', 'varchar(66)', (col) => col.notNull())
    .addColumn('vault_name', 'varchar(66)', (col) => col.notNull())
    .addColumn('strategy', 'varchar(66)', (col) => col.notNull())
    .addColumn('strategy_id', 'varchar(255)', (col) => col.notNull())
    .addColumn('amount', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('amount_usd', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('balance', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('balance_usd', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('network', sql`network`, (col) => col.notNull())
    .addColumn('action_type', sql`action_type`, (col) => col.notNull())
    .addColumn('input_token_price_usd', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('input_token_symbol', 'varchar(66)', (col) => col.notNull())
    .addColumn('input_token_decimals', 'bigint', (col) => col.notNull())
    .addColumn('tx_hash', 'varchar(66)', (col) => col.notNull())
    .addColumn('timestamp', 'bigint', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.dropTable('latest_activity').execute()
}
