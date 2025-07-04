import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  await db.schema
    .createTable('yield_race_games')
    .addColumn('game_id', 'varchar(64)', (col) => col.notNull().primaryKey())
    .addColumn('response_times', 'jsonb') // array of numbers
    .addColumn('score', 'bigint', (col) => col.notNull().defaultTo(0))
    .addColumn('timestamp_start', 'bigint', (col) => col.notNull().defaultTo(0))
    .addColumn('timestamp_end', 'bigint', (col) => col.notNull().defaultTo(0))
    .addColumn('user_address', 'varchar(42)', (col) => col.notNull())
    .addColumn('updated_at', 'bigint', (col) =>
      col.notNull().defaultTo(sql`extract(epoch from now())`),
    )
    .addUniqueConstraint('yield_race_games_user_address_unique', ['user_address'])
    .execute()

  await db.schema
    .createTable('yield_race_leaderboard')
    .addColumn('game_id', 'varchar(64)', (col) => col.notNull())
    .addColumn('response_times', 'jsonb', (col) => col.notNull()) // array of numbers
    .addColumn('score', 'bigint', (col) => col.notNull().defaultTo(0))
    .addColumn('signed_message', 'text', (col) => col.notNull())
    .addColumn('user_address', 'varchar(42)', (col) => col.notNull())
    .addColumn('updated_at', 'bigint', (col) =>
      col.notNull().defaultTo(sql`extract(epoch from now())`),
    )
    .addUniqueConstraint('yield_race_leaderboard_user_address_unique', ['user_address'])
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.dropTable('yield_race_games').execute()
  await db.schema.dropTable('yield_race_leaderboard').execute()
}
