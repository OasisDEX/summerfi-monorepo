import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>) {
  await db.schema
    .createTable('merchandise_signatures')
    .ifNotExists()
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'varchar(42)', (col) => col.notNull())
    .addColumn('merchandise_type', 'varchar(100)', (col) => col.notNull())
    .addColumn('signature', 'varchar(255)', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`NOW()`))
    .execute()
}

export async function down(db: Kysely<never>) {
  await db.schema.dropTable('merchandise_signatures').execute()
}
