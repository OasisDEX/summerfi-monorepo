import { Kysely } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  await db.schema
    .alterTable('yield_race_leaderboard')
    .addColumn('ens', 'varchar(42)', (col) => col.notNull().defaultTo(''))
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.alterTable('yield_race_leaderboard').dropColumn('ens').execute()
}
