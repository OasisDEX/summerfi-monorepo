import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  // Tickets table
  await db.schema
    .createTable('feedback_tickets')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('user_sub', 'text', (col) => col.notNull())
    .addColumn('institution_id', 'text', (col) => col.notNull())
    .addColumn('url', 'text')
    .addColumn('category', 'text')
    .addColumn('status', 'text', (col) => col.notNull().defaultTo('new'))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW()`))
    .execute()

  // Messages table
  await db.schema
    .createTable('feedback_messages')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('feedback_ticket_id', 'uuid', (col) =>
      col.notNull().references('feedback_tickets.id').onDelete('cascade'),
    )
    .addColumn('author_sub', 'text', (col) => col.notNull())
    .addColumn('author_type', 'text', (col) => col.notNull())
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW()`))
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.dropTable('feedback_messages').execute()
  await db.schema.dropTable('feedback_tickets').execute()
}
