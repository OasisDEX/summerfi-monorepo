import { Kysely } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  await db.schema
    .alterTable('yield_race_leaderboard')
    .addColumn('is_banned', 'boolean', (col) => col.notNull().defaultTo(false))
    .execute()
  await db.schema
    .alterTable('yield_race_games')
    .addColumn('games_played', 'integer', (col) => col.notNull().defaultTo(0))
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.alterTable('yield_race_leaderboard').dropColumn('is_banned').execute()
  await db.schema.alterTable('yield_race_games').dropColumn('games_played').execute()
}
