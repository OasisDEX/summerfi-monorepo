import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>) {
  await sql`
    DELETE FROM cron.job;
  `.execute(db)

  await sql`
      CREATE OR REPLACE FUNCTION schedule_leaderboard_refresh() RETURNS void AS $$
      DECLARE
        cron_id bigint;
      BEGIN
        SELECT cron.schedule('0 * * * *', 'SELECT refresh_leaderboard()') INTO cron_id;
        RAISE NOTICE 'leaderboard refresh scheduled with job id: %', cron_id;
      END;
      $$ LANGUAGE plpgsql;
    `.execute(db)

  await sql`
    SELECT schedule_leaderboard_refresh();
  `.execute(db)
}

export async function down(db: Kysely<never>) {
  await sql`
    DELETE FROM cron.job;
  `.execute(db)

  await sql`
      DROP FUNCTION IF EXISTS schedule_leaderboard_refresh;
    `.execute(db)
}
