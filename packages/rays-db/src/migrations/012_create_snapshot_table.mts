import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>) {
 await db.schema
   .createTable('snapshot')
   .addColumn('id', 'serial', (col) => col.primaryKey())
   .addColumn('user_address_id', 'integer', (col) => col.notNull())
   .addColumn('name', 'varchar(100)', (col) => col.notNull())
   .addColumn('points', 'decimal(20, 10)', (col) => col.notNull().defaultTo(0))
   .addColumn('sumr_awarded', 'decimal(20, 10)', (col) => col.notNull().defaultTo(0))
   .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW()`))
   .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW()`))
   .execute()

 await sql`CREATE TRIGGER update_snapshot_updated_at
   BEFORE UPDATE ON snapshot
   FOR EACH ROW
   EXECUTE FUNCTION update_modified_column();`.execute(db)
}

export async function down(db: Kysely<never>) {
 await sql`DROP TRIGGER IF EXISTS update_snapshot_updated_at ON snapshot`.execute(db)
 await db.schema.dropTable('snapshot').execute()
}

