import { Kysely } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  await db.schema
    .createTable('armada_dca_orders')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('user_address', 'varchar', (col) => col.notNull())
    .addColumn('chain_id', 'integer', (col) => col.notNull())
    .addColumn('from_vault', 'varchar', (col) => col.notNull())
    .addColumn('to_vault', 'varchar', (col) => col.notNull())
    .addColumn('amount', 'varchar', (col) => col.notNull())
    .addColumn('slippage', 'varchar', (col) => col.notNull())
    .addColumn('interval_seconds', 'integer', (col) => col.notNull())
    .addColumn('next_execution_at', 'bigint', (col) => col.notNull())
    .addColumn('deadline', 'varchar')
    .addColumn('max_trades', 'integer', (col) => col.notNull())
    .addColumn('allowed_vaults_root', 'varchar', (col) => col.notNull())
    .addColumn('from_vault_proof', 'jsonb', (col) => col.notNull())
    .addColumn('to_vault_proof', 'jsonb', (col) => col.notNull())
    .addColumn('swap_calldata', 'text', (col) => col.notNull())
    .addColumn('signature', 'varchar', (col) => col.notNull())
    .addColumn('enso_router_address', 'varchar', (col) => col.notNull())
    .addColumn('verifying_contract_address', 'varchar', (col) => col.notNull())
    .addColumn('status', 'varchar', (col) => col.notNull().defaultTo('active'))
    .addColumn('created_at', 'bigint', (col) => col.notNull())
    .addColumn('updated_at', 'bigint', (col) => col.notNull())
    .addColumn('cancelled_at', 'bigint')
    .addColumn('paused_at', 'bigint')
    .addColumn('trades_executed', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('never_buy_above', 'varchar')
    .addColumn('never_sell_below', 'varchar')
    .execute()

  await db.schema
    .createIndex('armada_dca_orders_user_idx')
    .on('armada_dca_orders')
    .columns(['user_address', 'chain_id', 'status'])
    .execute()

  await db.schema
    .createIndex('armada_dca_orders_next_execution_idx')
    .on('armada_dca_orders')
    .column('next_execution_at')
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  // No data was ever added for this migration, so no restoration is required.
  // Guard drops with `ifExists()` to avoid errors if the objects are already absent.
  // Drop indexes created in `up()` before dropping the table.
  await db.schema.dropIndex('armada_dca_orders_user_idx').ifExists().execute()
  await db.schema.dropIndex('armada_dca_orders_next_execution_idx').ifExists().execute()

  await db.schema.dropTable('armada_dca_orders').ifExists().execute()
}
