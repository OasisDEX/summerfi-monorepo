import { Kysely } from 'kysely'

export async function up(db: Kysely<never>) {
  await db.schema.alterTable('position').addColumn('details', 'jsonb').execute()
}

export async function down(db: Kysely<never>) {
  await db.schema.alterTable('position').dropColumn('details').execute()
}
