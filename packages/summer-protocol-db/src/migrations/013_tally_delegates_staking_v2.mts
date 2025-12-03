import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  await db.schema
    .createTable('tally_delegates_v2')
    .addColumn('user_address', 'varchar(42)', (col) => col.notNull().primaryKey())
    .addColumn('display_name', 'varchar(255)', (col) => col.notNull().defaultTo(''))
    .addColumn('ens', 'varchar(255)', (col) => col.notNull().defaultTo(''))
    .addColumn('x', 'varchar(255)', (col) => col.notNull().defaultTo(''))
    .addColumn('bio', 'varchar(600)', (col) => col.notNull().defaultTo(''))
    .addColumn('custom_bio', 'varchar(600)', (col) => col.notNull().defaultTo(''))
    .addColumn('photo', 'varchar(255)', (col) => col.notNull().defaultTo(''))
    .addColumn('votes_count', 'numeric', (col) => col.notNull())
    .addColumn('votes_count_normalized', 'numeric', (col) => col.notNull())
    .addColumn('delegators_count', 'numeric', (col) => col.notNull())
    .addColumn('vote_power', 'numeric', (col) => col.notNull())
    .addColumn('custom_title', 'varchar(255)', (col) => col.notNull().defaultTo(''))
    .addColumn('forum_url', 'varchar(255)', (col) => col.notNull().defaultTo(''))
    .addColumn('updated_at', 'bigint', (col) =>
      col.notNull().defaultTo(sql`extract(epoch from now())`),
    )
    .addUniqueConstraint('tally_delegates_v2_user_address_unique', ['user_address'])
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.dropTable('tally_delegates_v2').execute()
}
