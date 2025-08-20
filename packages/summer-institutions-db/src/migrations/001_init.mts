import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  // Institutions table
  await db.schema
    .createTable('institutions')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar', (col) => col.notNull()) // institution name
    .addColumn('display_name', 'varchar', (col) => col.notNull()) // display name for the institution
    .addColumn('logo_url', 'varchar', (col) => col.notNull().defaultTo('')) // optional URL for the logo
    .addColumn('logo_file', 'bytea') // optional binary data for the logo file
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .addUniqueConstraint('institutions_unique', ['name'])
    .execute()

  // Institution Users -> Create role enum
  await db.schema.createType('user_role').asEnum(['Viewer', 'RoleAdmin', 'SuperAdmin']).execute()

  // Institution Users join table (maps cognito User ID to institution [allows multiple users per institution])
  await db.schema
    .createTable('institution_users')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('institution_id', 'integer', (col) =>
      col.notNull().references('institutions.id').onDelete('cascade')
    ) // foreign key to institutions table
    .addColumn('user_sub', 'varchar', (col) => col.notNull()) // cognito User ID (Sub)
    .addColumn('role', sql`user_role`) // role: 'Viewer', 'RoleAdmin', 'SuperAdmin'
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .addUniqueConstraint('institution_user_unique', ['institution_id', 'user_sub'])
    .execute()

  // Global Admins join table (for managing institutions)
  await db.schema
    .createTable('global_admins')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_sub', 'varchar', (col) => col.notNull().unique()) // Cognito user ID
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.dropTable('institutions').execute()
  await db.schema.dropTable('institution_users').execute()
  await db.schema.dropType('user_role').execute()
  await db.schema.dropTable('global_admins').execute()
}
