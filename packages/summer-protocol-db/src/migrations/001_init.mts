import { Kysely } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  await db.schema
    .createTable('tos_approval')
    .addColumn('address', 'varchar(66)', (col) => col.notNull())
    .addColumn('doc_version', 'varchar', (col) => col.notNull())
    .addColumn('sign_date', 'timestamp(6)', (col) => col.notNull())
    .addColumn('signature', 'varchar', (col) => col.defaultTo('0x0').notNull())
    .addColumn('message', 'varchar', (col) => col.defaultTo('0x0').notNull())
    .addColumn('chain_id', 'integer', (col) => col.defaultTo(0).notNull())
    .addUniqueConstraint('tos_approval_unique', ['address', 'chain_id', 'doc_version'])
    .execute()

  await db.schema
    .createTable('wallet_risk')
    .addColumn('address', 'varchar(66)', (col) => col.notNull())
    .addColumn('last_check', 'timestamp(6)', (col) => col.notNull())
    .addColumn('is_risky', 'boolean', (col) => col.notNull())
    .addUniqueConstraint('wallet_risk_unique', ['address'])
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.dropTable('tos_approval').execute()
  await db.schema.dropTable('wallet_risk').execute()
}
