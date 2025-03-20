import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  // Create action type enum
  await sql`CREATE TYPE action_type AS ENUM ('deposit', 'withdraw')`.execute(db)
  await sql`ALTER TYPE network ADD VALUE IF NOT EXISTS 'sonic'`.execute(db)

  await db.schema
    .createTable('top_depositors')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('user_address', 'varchar(42)', (col) => col.notNull())
    .addColumn('vault_id', 'varchar(66)', (col) => col.notNull())
    .addColumn('vault_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('strategy', 'varchar(66)', (col) => col.notNull())
    .addColumn('strategy_id', 'varchar(255)', (col) => col.notNull())
    .addColumn('balance', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('balance_usd', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('network', sql`network`, (col) => col.notNull())
    .addColumn('change_seven_days', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('no_of_deposits', 'bigint', (col) => col.notNull())
    .addColumn('no_of_withdrawals', 'bigint', (col) => col.notNull())
    .addColumn('projected_one_year_earnings', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('projected_one_year_earnings_usd', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('earnings_streak', 'bigint', (col) => col.notNull())
    .addColumn('input_token_price_usd', 'decimal(78, 18)', (col) => col.notNull())
    .addColumn('input_token_symbol', 'varchar(66)', (col) => col.notNull())
    .addColumn('input_token_decimals', 'bigint', (col) => col.notNull())
    .addColumn('updated_at', 'bigint', (col) => col.notNull())
    .addUniqueConstraint('top_depositors_vault_id_user_address_network_unique', [
      'vault_id',
      'user_address',
      'network',
    ])
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.dropTable('top_depositors').execute()
  await sql`DROP TYPE action_type`.execute(db)
}
