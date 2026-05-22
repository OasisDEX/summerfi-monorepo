import { Kysely } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  //remove all rows in this table on migration since we are making orderId non-nullable and we don't have it for existing rows
  await db.deleteFrom('armada_dca_orders').execute()
  await db.schema
    .alterTable('armada_dca_orders')
    // should be non-null orderId
    .addColumn('order_id', 'varchar', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.alterTable('armada_dca_orders').dropColumn('order_id').execute()
}
