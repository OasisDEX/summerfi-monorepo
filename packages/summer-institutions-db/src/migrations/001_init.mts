import { Kysely } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  await db.schema
    .createTable('institutions')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('display_name', 'varchar', (col) => col.notNull())
    .addColumn('logo_url', 'varchar', (col) => col.notNull().defaultTo('')) // optional URL for the logo
    .addColumn('logo_file', 'bytea') // optional binary data for the logo file
    .addUniqueConstraint('institutions_unique', ['name'])
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.dropTable('institutions').execute()
}
