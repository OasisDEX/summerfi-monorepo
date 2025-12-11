import { Kysely } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  await db.schema
    .createIndex('idx_daily_reward_lookup')
    .on('daily_reward_rate')
    .columns(['network', 'product_id', 'date'])
    .execute()

  await db.schema
    .createIndex('idx_hourly_reward_lookup')
    .on('hourly_reward_rate')
    .columns(['network', 'product_id', 'date'])
    .execute()

  await db.schema
    .createIndex('idx_weekly_reward_lookup')
    .on('weekly_reward_rate')
    .columns(['network', 'product_id', 'week_timestamp'])
    .execute()

  await db.schema
    .createIndex('idx_reward_rate_lookup')
    .on('reward_rate')
    .columns(['network', 'product_id', 'timestamp'])
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.dropIndex('idx_daily_reward_lookup').execute()
  await db.schema.dropIndex('idx_hourly_reward_lookup').execute()
  await db.schema.dropIndex('idx_weekly_reward_lookup').execute()
  await db.schema.dropIndex('idx_reward_rate_lookup').execute()
}