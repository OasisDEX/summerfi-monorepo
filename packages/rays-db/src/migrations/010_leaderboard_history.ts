import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>) {
  await sql`
      CREATE TABLE IF NOT EXISTS leaderboard_history  (
          user_address_id character varying(50) PRIMARY KEY,
          position_0h bigint NOT NULL,
          position_2h bigint,
          position_4h bigint,
          position_6h bigint,
          position_8h bigint,
          position_10h bigint,
          position_12h bigint,
          position_14h bigint,
          position_16h bigint,
          position_18h bigint,
          position_20h bigint,
          position_22h bigint,
          points_0h numeric NOT NULL,
          points_2h numeric,
          points_4h numeric,
          points_6h numeric,
          points_8h numeric,
          points_10h numeric,
          points_12h numeric,
          points_14h numeric,
          points_16h numeric,
          points_18h numeric,
          points_20h numeric,
          points_22h numeric,
          last_updated timestamp with time zone DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_leaderboard_history_last_updated ON leaderboard_history(last_updated timestamptz_ops);
      CREATE INDEX IF NOT EXISTS idx_leaderboard_history_position_0h ON leaderboard_history(position_0h int8_ops);
  `.execute(db)

  await sql`
      CREATE OR REPLACE FUNCTION refresh_leaderboard_history()
        RETURNS void AS $$
        BEGIN
            WITH computed_points AS (
                SELECT 
                    COALESCE(p.user_address_id, pd.user_address_id) AS coalesced_user_address_id,
                    SUM(pd.points) AS total_points
                FROM 
                    points_distribution pd
                LEFT JOIN 
                    position p ON pd.position_id = p.id
                GROUP BY 
                    COALESCE(p.user_address_id, pd.user_address_id)
                HAVING 
                    SUM(pd.points) > 0
            ),
            new_leaderboard AS (
                SELECT
                    ROW_NUMBER() OVER (ORDER BY cp.total_points DESC) AS position,
                    ua.address AS user_address,
                    COALESCE(cp.total_points, 0) AS total_points
                FROM 
                    user_address ua
                INNER JOIN 
                    computed_points cp ON ua.id = cp.coalesced_user_address_id        
                ORDER BY 
                    total_points DESC
            )
            INSERT INTO leaderboard_history (
                user_address_id, 
                position_0h, position_2h, position_4h, position_6h, position_8h, 
                position_10h, position_12h, position_14h, position_16h, position_18h, position_20h, position_22h,
                points_0h, points_2h, points_4h, points_6h, points_8h, 
                points_10h, points_12h, points_14h, points_16h, points_18h, points_20h, points_22h,
                last_updated
            )
            SELECT 
                nl.user_address,
                nl.position, lh.position_0h, lh.position_2h, lh.position_4h, lh.position_6h, 
                lh.position_8h, lh.position_10h, lh.position_12h, lh.position_14h, lh.position_16h, lh.position_18h, lh.position_20h,
                nl.total_points, lh.points_0h, lh.points_2h, lh.points_4h, lh.points_6h, 
                lh.points_8h, lh.points_10h, lh.points_12h, lh.points_14h, lh.points_16h, lh.points_18h, lh.points_20h,
                CURRENT_TIMESTAMP
            FROM new_leaderboard nl
            LEFT JOIN leaderboard_history lh ON nl.user_address = lh.user_address_id
            ON CONFLICT (user_address_id) 
            DO UPDATE SET
                position_22h = leaderboard_history.position_20h,
                position_20h = leaderboard_history.position_18h,
                position_18h = leaderboard_history.position_16h,
                position_16h = leaderboard_history.position_14h,
                position_14h = leaderboard_history.position_12h,
                position_12h = leaderboard_history.position_10h,
                position_10h = leaderboard_history.position_8h,
                position_8h = leaderboard_history.position_6h,
                position_6h = leaderboard_history.position_4h,
                position_4h = leaderboard_history.position_2h,
                position_2h = leaderboard_history.position_0h,
                position_0h = EXCLUDED.position_0h,
                points_22h = leaderboard_history.points_20h,
                points_20h = leaderboard_history.points_18h,
                points_18h = leaderboard_history.points_16h,
                points_16h = leaderboard_history.points_14h,
                points_14h = leaderboard_history.points_12h,
                points_12h = leaderboard_history.points_10h,
                points_10h = leaderboard_history.points_8h,
                points_8h = leaderboard_history.points_6h,
                points_6h = leaderboard_history.points_4h,
                points_4h = leaderboard_history.points_2h,
                points_2h = leaderboard_history.points_0h,
                points_0h = EXCLUDED.points_0h,
                last_updated = EXCLUDED.last_updated;
        END;
    $$ LANGUAGE plpgsql;
  `.execute(db)

  const jobExists = await sql`
    SELECT jobid 
    FROM cron.job
    WHERE schedule = '0 */2 * * *' 
      AND command = 'SELECT refresh_leaderboard_history()'
  `.execute(db)

  // Since we already have these jobs in db, we need to make sure that we won't add new one
  if (Array.isArray(jobExists.rows) && jobExists.rows.length === 0) {
    await sql`
     SELECT cron.schedule('refresh_leaderboard_history','0 */2 * * *', 'SELECT refresh_leaderboard_history()');
  `.execute(db)
  }
}

export async function down(db: Kysely<never>) {
  await sql`
     SELECT cron.unschedule('refresh_leaderboard_history');
  `.execute(db)

  await sql`DROP FUNCTION IF EXISTS refresh_leaderboard_history`.execute(db)

  await sql`
    DROP TABLE IF EXISTS leaderboard_history CASCADE;
    `.execute(db)
}
