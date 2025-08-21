import { Kysely } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  await db.schema
    .alterTable('institution_users')
    .addColumn('user_name', 'varchar', (col) => col.notNull().defaultTo('')) // cognito user name
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema
    .alterTable('institution_users')
    .dropColumn('user_name')
    .execute()
}