import { Kysely, sql } from 'kysely'

/**
 * @param db {Kysely<any>}
 */
export async function up(db: Kysely<never>) {
  await db.schema.createTable('user').addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('category', 'varchar(50)')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .execute()

  await db.schema.createType('address_type').asEnum(['ETH', 'SOL']).execute()

  await db.schema
    .createTable('user_address')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('address', 'varchar(50)', (col) => col.notNull().unique())
    .addColumn('type', sql`address_type`, (col) => col.notNull().defaultTo('ETH'))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .addColumn('user_id', 'integer', (col) => col.notNull().references('user.id').onDelete('restrict'))
    .execute()

  await db.schema.createIndex('user_address_address_index').on('user_address').columns(['address']).execute()

  await db.schema.createType('protocol').asEnum(['AAVE_v3', 'MorphoBlue', 'Ajna', 'Spark', 'AAVE_v2', 'ERC_4626']).execute()

  await db.schema.createTable('proxy')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('address', 'varchar(50)', (col) => col.notNull())
    .addColumn('chain_id', 'integer', (col) => col.notNull())
    .addColumn('type', 'varchar(100)', (col) => col.notNull())
    .addColumn('managed_by', 'varchar(100)', (col) => col.notNull())
    .addColumn('user_address_id', 'integer', (col) => col.notNull().references('user_address.id').onDelete('restrict'))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .execute()

  await db.schema.createTable('position')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('protocol', sql`protocol`, (col) => col.notNull())
    .addColumn('chain_id', 'integer', (col) => col.notNull())
    .addColumn('market', 'varchar(255)', (col) => col.notNull())
    .addColumn('address', 'varchar(50)', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .addColumn('proxy_id', 'integer', (col) => col.references('proxy.id').onDelete('restrict'))
    .addColumn('user_address_id', 'integer', (col) => col.notNull().references('user_address.id').onDelete('restrict'))
    .execute()

  await db.schema
    .createTable('eligibility_condition')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('description', 'varchar', (col) => col.notNull())
    .addColumn('due_date', 'timestamptz', (col) => col.notNull())
    .addColumn('type', 'varchar(100)', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .addColumn('metadata', 'jsonb', (col) => col.notNull())
    .execute()

  await db.schema
    .createTable('points_distribution')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('points', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('description', 'varchar', (col) => col.notNull())
    .addColumn('type', 'varchar(100)', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .addColumn('position_id', 'integer', (col) => col.notNull().references('position.id').onDelete('restrict'))
    .addColumn('eligibility_condition_id', 'integer', (col) => col.references('eligibility_condition.id').onDelete('restrict'))
    .execute()


}

/**
 * @param db {Kysely<any>}
 */
export async function down(db: Kysely<never>) {
  await db.schema.dropTable('points_distribution').execute()
  await db.schema.dropTable('eligibility_condition').execute()
  await db.schema.dropTable('position').execute()
  await db.schema.dropIndex('user_address_address_index').execute()
  await db.schema.dropTable('user_address').execute()
  await db.schema.dropType('address_type').execute()
  await db.schema.dropTable('user').execute()
}
