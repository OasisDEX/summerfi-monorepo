import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  // Create enum types
  await db.schema
    .createType('feedback_category')
    .asEnum(['question', 'bug', 'feature-request'])
    .execute()

  await db.schema
    .createType('feedback_status')
    .asEnum(['new', 'in-progress', 'resolved', 'closed'])
    .execute()

  await db.schema.createType('feedback_author_type').asEnum(['user', 'admin', 'system']).execute()

  // Single messages table with thread support
  await db.schema
    .createTable('feedback_messages')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('thread_id', 'integer', (col) => col.notNull())
    .addColumn('parent_id', 'integer', (col) =>
      col.references('feedback_messages.id').onDelete('cascade'),
    )
    .addColumn('institution_id', 'integer', (col) =>
      col.notNull().references('institutions.id').onDelete('cascade'),
    )
    .addColumn('author_sub', 'varchar')
    .addColumn('author_name', 'varchar')
    .addColumn('author_email', 'varchar')
    .addColumn('author_type', sql`feedback_author_type`, (col) => col.notNull())
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('url', 'varchar')
    .addColumn('category', sql`feedback_category`)
    .addColumn('status', sql`feedback_status`, (col) =>
      col.notNull().defaultTo(sql`'new'::feedback_status`),
    )
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`NOW()`))
    .execute()

  // Indexes
  await db.schema
    .createIndex('feedback_messages_thread_id_idx')
    .on('feedback_messages')
    .column('thread_id')
    .execute()

  await db.schema
    .createIndex('feedback_messages_institution_id_idx')
    .on('feedback_messages')
    .column('institution_id')
    .execute()

  await db.schema
    .createIndex('feedback_messages_status_idx')
    .on('feedback_messages')
    .column('status')
    .execute()

  await db.schema
    .createIndex('feedback_messages_parent_id_idx')
    .on('feedback_messages')
    .column('parent_id')
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.dropTable('feedback_messages').execute()
  await db.schema.dropType('feedback_author_type').execute()
  await db.schema.dropType('feedback_status').execute()
  await db.schema.dropType('feedback_category').execute()
}
