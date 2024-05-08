import { Kysely, sql } from 'kysely'

/**
 * @param db {Kysely<any>}
 */
export async function up(db: Kysely<never>) {
  await db.schema.createType('position_type').asEnum(['Supply', 'Lend']).execute()

  await db.schema.alterTable('position').addColumn('type', sql`position_type`, (col) => col.notNull().defaultTo('Lend')).execute()

  await db.schema.createTable('multiplier')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('value', 'integer', (col) => col.notNull())
    .addColumn('type', 'varchar(100)', (col) => col.notNull())
    .addColumn('description', 'varchar')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .execute()

  await db.schema.createTable('position_multiplier')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('position_id', 'integer', (col) => col.notNull().references('position.id').onDelete('restrict'))
    .addColumn('multiplier_id', 'integer', (col) => col.notNull().references('multiplier.id').onDelete('restrict'))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .execute()

  await db.schema.createTable('user_address_multiplier')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_address_id', 'integer', (col) => col.notNull().references('user_address.id').onDelete('restrict'))
    .addColumn('multiplier_id', 'integer', (col) => col.notNull().references('multiplier.id').onDelete('restrict'))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .execute()

}

/**
 * @param db {Kysely<any>}
 */
export async function down(db: Kysely<never>) {
  await db.schema.dropTable('user_multiplier').execute()
  await db.schema.dropTable('position_multiplier').execute()
  await db.schema.dropTable('multiplier').execute()
  await db.schema.alterTable('position').dropColumn('type').execute()
  await db.schema.dropType('position_type').execute()
}
