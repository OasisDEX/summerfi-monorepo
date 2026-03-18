import { Kysely } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  await db.schema
    .createTable('vault_benchmark')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('chain_id', 'integer', (col) => col.notNull())
    .addColumn('asset', 'varchar', (col) => col.notNull())
    .addColumn('timestamp', 'timestamptz', (col) => col.notNull())
    .addColumn('apy1d_base', 'numeric', (col) => col.notNull())
    .addColumn('apy1d_reward', 'numeric', (col) => col.notNull())
    .addColumn('apy1d_total', 'numeric', (col) => col.notNull())
    .addColumn('apy7d_base', 'numeric', (col) => col.notNull())
    .addColumn('apy7d_reward', 'numeric', (col) => col.notNull())
    .addColumn('apy7d_total', 'numeric', (col) => col.notNull())
    .addColumn('apy30d_base', 'numeric', (col) => col.notNull())
    .addColumn('apy30d_reward', 'numeric', (col) => col.notNull())
    .addColumn('apy30d_total', 'numeric', (col) => col.notNull())
    .addUniqueConstraint('vault_benchmark_asset_timestamp_unique', [
      'chain_id',
      'asset',
      'timestamp',
    ])
    .execute()

  await db.schema
    .createIndex('vault_benchmark_query_idx')
    .on('vault_benchmark')
    .columns(['chain_id', 'asset', 'timestamp'])
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.dropTable('vault_benchmark').execute()
}
