import { Kysely, sql } from 'kysely'
import * as console from 'node:console'

/**
 * @param db {Kysely<any>}
 */
export async function up(db: Kysely<never>) {
  await sql`CREATE FUNCTION update_modified_column()
      RETURNS TRIGGER AS
  $$
  BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
  END;
  $$ LANGUAGE 'plpgsql';`.execute(db)

  console.log('Creating table blockchain_user')

  await db.schema.createTable('blockchain_user').addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('category', 'varchar(50)')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .execute()

  await sql`CREATE TRIGGER update_user_updated_at
      BEFORE UPDATE
      ON blockchain_user
      FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();`.execute(db)

  await db.schema.createType('address_type').asEnum(['ETH', 'SOL']).execute()

  console.log('Creating table user_address')

  await db.schema
    .createTable('user_address')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('address', 'varchar(50)', (col) => col.notNull().unique())
    .addColumn('type', sql`address_type`, (col) => col.notNull().defaultTo('ETH'))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .addColumn('user_id', 'integer', (col) => col.notNull().references('blockchain_user.id').onDelete('restrict'))
    .addUniqueConstraint('user_address_address_unique', ['address'])
    .execute()

  await db.schema.createIndex('user_address_address_index').on('user_address').columns(['address']).execute()

  await sql`CREATE TRIGGER update_user_address_updated_at
      BEFORE UPDATE
      ON user_address
      FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();`.execute(db)

  await db.schema.createType('protocol').asEnum(['aave_v2', 'morphoblue', 'ajna', 'spark', 'aave_v3', 'erc4626', 'maker']).execute()

  await db.schema.createType('position_type').asEnum(['Supply', 'Lend']).execute()

  console.log('Creating table position')

  await db.schema.createTable('position')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('external_id', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('protocol', sql`protocol`, (col) => col.notNull())
    .addColumn('chain_id', 'integer', (col) => col.notNull())
    .addColumn('market', 'varchar(255)', (col) => col.notNull())
    .addColumn('type', sql`position_type`, (col) => col.notNull().defaultTo('Lend'))
    .addColumn('address', 'varchar(50)', (col) => col.notNull())
    .addColumn('vault_id', 'integer', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .addColumn('user_address_id', 'integer', (col) => col.notNull().references('user_address.id').onDelete('restrict'))
    .execute()

  await db.schema.createIndex('position_external_id_index').on('position').columns(['external_id']).execute()
  await db.schema.createIndex('position_address_index').on('position').columns(['address']).execute()

  await sql`CREATE TRIGGER update_position_updated_at
      BEFORE UPDATE
      ON position
      FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();`.execute(db)

  console.log('Creating table eligibility_condition')

  await db.schema
    .createTable('eligibility_condition')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('description', 'varchar', (col) => col.notNull())
    .addColumn('due_date', 'timestamptz', (col) => col.notNull())
    .addColumn('type', 'varchar(100)', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .addColumn('metadata', 'jsonb', (col) => col.notNull())
    .execute()

  await sql`CREATE TRIGGER update_eligibility_condition_updated_at
      BEFORE UPDATE
      ON eligibility_condition
      FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();`.execute(db)

  console.log('Creating table points_distribution')

  await db.schema
    .createTable('points_distribution')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('points', 'decimal(20, 10)', (col) => col.notNull().defaultTo(0))
    .addColumn('description', 'varchar', (col) => col.notNull())
    .addColumn('type', 'varchar(100)', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .addColumn('eligibility_condition_id', 'integer', (col) => col.references('eligibility_condition.id').onDelete('restrict'))
    .addColumn('position_id', 'integer', (col) => col.references('position.id').onDelete('restrict'))
    .addColumn('user_address_id', 'integer', (col) => col.references('user_address.id').onDelete('restrict'))
    .addCheckConstraint('points_distribution_position_id_user_address_id_check', sql`(position_id IS NULL AND user_address_id IS NOT NULL)
                                                                                     OR (position_id IS NOT NULL AND user_address_id IS NULL)`)
    .execute()

  await sql`CREATE TRIGGER update_points_distribution_updated_at
      BEFORE UPDATE
      ON points_distribution
      FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();`.execute(db)

  console.log('Creating table multiplier')

  await db.schema.createTable('multiplier')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('value', 'decimal(6, 4)', (col) => col.notNull())
    .addColumn('type', 'varchar(100)', (col) => col.notNull())
    .addColumn('description', 'varchar')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW
        ()`))
    .addColumn('position_id', 'integer', (col) => col.references('position.id').onDelete('restrict'))
    .addColumn('user_address_id', 'integer', (col) => col.references('user_address.id').onDelete('restrict'))
    .addCheckConstraint('multiplier_position_id_user_address_id_check', sql`(position_id IS NULL AND user_address_id IS NOT NULL)
                                                                            OR (position_id IS NOT NULL AND user_address_id IS NULL)`)
    .execute()

  await sql`CREATE TRIGGER update_multiplier_updated_at
      BEFORE UPDATE
      ON multiplier
      FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();`.execute(db)

  console.log('Creating table position_multiplier')
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db: Kysely<never>) {
  console.log('Dropping tables')

  console.log(`Dropping table multiplier`)
  await sql`DROP TRIGGER IF EXISTS update_multiplier_updated_at ON multiplier`.execute(db)
  await db.deleteFrom('multiplier').execute()
  await db.schema.dropTable('multiplier').execute()

  console.log(`Dropping table points_distribution`)
  await sql`DROP TRIGGER IF EXISTS update_points_distribution_updated_at ON points_distribution`.execute(db)
  await db.deleteFrom('points_distribution').execute()
  await db.schema.dropTable('points_distribution').execute()

  console.log(`Dropping table eligibility_condition`)
  await sql`DROP TRIGGER IF EXISTS update_eligibility_condition_updated_at ON eligibility_condition`.execute(db)
  await db.deleteFrom('eligibility_condition').execute()
  await db.schema.dropTable('eligibility_condition').execute()

  console.log(`Dropping table position`)
  await sql`DROP TRIGGER IF EXISTS update_position_updated_at ON position`.execute(db)
  console.log(`Dropping index position_external_id_index`)
  // await db.schema.dropIndex('position_external_id_index').on('position').execute()
  await db.deleteFrom('position').execute()
  await db.schema.dropTable('position').execute()

  console.log(`Dropping types position_type`)
  await db.schema.dropType('position_type').execute()
  await db.schema.dropType('protocol').execute()

  console.log(`Dropping table user_address`)
  await sql`DROP TRIGGER IF EXISTS update_user_address_updated_at ON user_address`.execute(db)
  await db.deleteFrom('user_address').execute()
  await db.schema.dropTable('user_address').execute()
  await db.schema.dropType('address_type').execute()

  console.log(`Dropping table blockchain_user`)
  await sql`DROP TRIGGER IF EXISTS update_user_updated_at ON blockchain_user`.execute(db)
  await db.schema.dropTable('blockchain_user').execute()

  await sql`DROP FUNCTION IF EXISTS update_modified_column`.execute(db)
  
}
