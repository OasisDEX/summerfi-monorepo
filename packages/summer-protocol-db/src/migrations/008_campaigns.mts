import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  await sql`
  DO $$ BEGIN
      CREATE TYPE campaign_type AS ENUM ('okx');
  EXCEPTION
      WHEN duplicate_object THEN null;
  END $$;
`.execute(db)

  await db.schema
    .createTable('campaigns')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_address', 'varchar(42)', (col) => col.notNull())
    .addColumn('campaign', sql`campaign_type`, (col) => col.notNull())
    .addColumn('timestamp', 'bigint', (col) => col.notNull())
    .addUniqueConstraint('campaigns_user_address_campaign_timestamp_unique', [
      'user_address',
      'campaign',
      'timestamp',
    ])
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.dropTable('campaigns').execute()
}
