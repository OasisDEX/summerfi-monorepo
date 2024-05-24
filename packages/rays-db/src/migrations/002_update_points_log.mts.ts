import { Kysely, sql } from 'kysely'

/**
 * @param db {Kysely<any>}
 */
export async function up(db: Kysely<never>) {
  await db.schema
    .createTable('update_points_changelog')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('metadata', 'jsonb', (col) => col.notNull())
    .addColumn('start_timestamp', 'timestamptz', (col) => col.notNull())
    .addColumn('end_timestamp', 'timestamptz', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`NOW
        ()`),
    )
    .execute()

  await db.schema
    .createTable('update_points_lock')
    .addColumn('id', 'varchar(50)', (col) => col.primaryKey())
    .addColumn('is_locked', 'boolean', (col) => col.notNull().defaultTo(false))
    .execute()

  await db
    .insertInto('update_points_lock')
    .values({ id: 'update_points_lock', is_locked: false })
    .execute()

  await db.schema
    .createTable('update_points_last_run')
    .addColumn('id', 'varchar(50)', (col) => col.primaryKey())
    .addColumn('last_timestamp', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`NOW
        ()`),
    )
    .execute()

  await db
    .insertInto('update_points_last_run')
    .values({
      id: 'update_points_last_run',
      last_timestamp: sql`NOW
            ()`,
    }) // That needs to be changed to the proper date.
    .execute()
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db: Kysely<never>) {
  await db.schema.dropTable('update_points_last_run').execute()
  await db.schema.dropTable('update_points_changelog').execute()
  await db.schema.dropTable('update_points_lock').execute()
}
