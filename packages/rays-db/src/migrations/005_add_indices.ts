import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>) {
  /* DO IT IN AWS CONSOLE - no permissions with admin account*/

  //     await sql`
  //     CREATE EXTENSION IF NOT EXISTS pg_cron;
  //   `.execute(db);

  await sql`
    DROP VIEW IF EXISTS leaderboard;
  `.execute(db)

  await sql`
    CREATE MATERIALIZED VIEW leaderboard AS
    WITH computed_points AS (
        SELECT 
            COALESCE(p.user_address_id, pd.user_address_id) AS user_address_id,
            SUM(pd.points) AS total_points
        FROM 
            points_distribution pd
        LEFT JOIN 
            position p ON pd.position_id = p.id
        GROUP BY 
            COALESCE(p.user_address_id, pd.user_address_id)
    )
    SELECT 
        ROW_NUMBER() OVER (ORDER BY total_points DESC) AS position,
        ua.address AS user_address,
        COALESCE(cp.total_points, 0) AS total_points
    FROM 
        user_address ua
    LEFT JOIN 
        computed_points cp ON ua.id = cp.user_address_id
    GROUP BY 
        ua.address, cp.total_points
    ORDER BY 
        total_points DESC;
    
  `.execute(db)

  await sql`
      CREATE OR REPLACE FUNCTION refresh_leaderboard() RETURNS void AS $$
      BEGIN
        REFRESH MATERIALIZED VIEW leaderboard;
      END;
      $$ LANGUAGE plpgsql;
    `.execute(db)

  await sql`
      CREATE OR REPLACE FUNCTION schedule_leaderboard_refresh() RETURNS void AS $$
      DECLARE
        cron_id bigint;
      BEGIN
        SELECT cron.schedule('0 * * * *', 'CALL refresh_leaderboard()') INTO cron_id;
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
    DROP MATERIALIZED VIEW IF EXISTS leaderboard;
  `.execute(db)

  await sql`
    DROP FUNCTION IF EXISTS refresh_leaderboard;
  `.execute(db)

  await sql`
    DROP FUNCTION IF EXISTS schedule_leaderboard_refresh;
  `.execute(db)
}
