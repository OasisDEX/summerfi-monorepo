import { Kysely } from 'kysely'

export async function up(db: Kysely<never>): Promise<void> {
  await db.schema
    .createIndex('idx_fleet_rate_lookup')
    .on('fleet_interest_rate')
    .columns(['network', 'fleet_address', 'timestamp'])
    .execute()

  await db.schema
    .createIndex('idx_hourly_fleet_rate_lookup')
    .on('hourly_fleet_interest_rate')
    .columns(['network', 'fleet_address', 'date'])
    .execute()

  await db.schema
    .createIndex('idx_daily_fleet_rate_lookup')
    .on('daily_fleet_interest_rate')
    .columns(['network', 'fleet_address', 'date'])
    .execute()
    
  await db.schema
    .createIndex('idx_weekly_fleet_rate_lookup')
    .on('weekly_fleet_interest_rate')
    .columns(['network', 'fleet_address', 'week_timestamp'])
    .execute()
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.dropIndex('idx_fleet_rate_lookup').execute()
  await db.schema.dropIndex('idx_hourly_fleet_rate_lookup').execute()
  await db.schema.dropIndex('idx_daily_fleet_rate_lookup').execute()
  await db.schema.dropIndex('idx_weekly_fleet_rate_lookup').execute()
}