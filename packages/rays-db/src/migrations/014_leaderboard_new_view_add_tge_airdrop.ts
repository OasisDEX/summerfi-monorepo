import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>) {
  await sql`DROP MATERIALIZED VIEW IF EXISTS leaderboard_new`.execute(db)

  await sql`
    CREATE MATERIALIZED VIEW leaderboard_new AS 
    WITH computed_points AS (
           SELECT COALESCE(p.user_address_id, pd.user_address_id) AS coalesced_user_address_id,
              sum(pd.points) AS total_points
             FROM points_distribution pd
               LEFT JOIN "position" p ON pd.position_id = p.id
            GROUP BY (COALESCE(p.user_address_id, pd.user_address_id))
           HAVING sum(pd.points) > 0::numeric
          ),
          snapshot_data AS (
            SELECT user_address_id, points as tge_snapshot_points, sumr_awarded as tge_sumr_awarded
            FROM snapshot WHERE name = 'tge'
          ),
          ranked_data AS (
           SELECT row_number() OVER (ORDER BY cp.total_points DESC) AS "position",
              rank() OVER (ORDER BY cp.total_points DESC) AS rank,
              ua.address AS user_address,
              COALESCE(cp.total_points, 0::numeric) AS total_points,
              COALESCE(sd.tge_snapshot_points, 0::numeric) AS tge_snapshot_points,
              COALESCE(sd.tge_sumr_awarded, 0::numeric) AS tge_sumr_awarded,
              ua.details,
              ua.ens
             FROM user_address ua
               JOIN computed_points cp ON ua.id = cp.coalesced_user_address_id
               LEFT JOIN snapshot_data sd ON ua.id = sd.user_address_id
          ), history_data AS (
           SELECT leaderboard_history.user_address_id,
              leaderboard_history.points_22h,
                  CASE
                      WHEN leaderboard_history.points_22h IS NULL THEN ( SELECT count(*) + 1
                         FROM leaderboard_history leaderboard_history_1
                        WHERE leaderboard_history_1.points_22h IS NOT NULL)
                      ELSE rank() OVER (ORDER BY (COALESCE(leaderboard_history.points_22h, 0::numeric)) DESC)
                  END AS rank_22h
             FROM leaderboard_history
          )
    SELECT rd."position",
      rd.rank,
      rd.user_address,
      rd.total_points,
      rd.tge_snapshot_points,
      rd.tge_sumr_awarded,
      rd.details,
      rd.ens,
      COALESCE(hd.rank_22h, ( SELECT count(*) + 1
             FROM history_data
            WHERE history_data.points_22h IS NOT NULL)) AS rank_22h,
      hd.points_22h
     FROM ranked_data rd
       LEFT JOIN history_data hd ON rd.user_address::text = hd.user_address_id::text
    ORDER BY rd.total_points DESC;
  `.execute(db)
}

export async function down(db: Kysely<never>) {
  await sql`DROP MATERIALIZED VIEW IF EXISTS leaderboard_new`.execute(db)

  await sql`
      CREATE
      MATERIALIZED VIEW IF NOT EXISTS leaderboard_new AS 
    WITH computed_points AS (
           SELECT COALESCE(p.user_address_id, pd.user_address_id) AS coalesced_user_address_id,
              sum(pd.points) AS total_points
             FROM points_distribution pd
               LEFT JOIN "position" p ON pd.position_id = p.id
            GROUP BY (COALESCE(p.user_address_id, pd.user_address_id))
           HAVING sum(pd.points) > 0::numeric
          ), ranked_data AS (
           SELECT row_number() OVER (ORDER BY cp.total_points DESC) AS "position",
              rank() OVER (ORDER BY cp.total_points DESC) AS rank,
              ua.address AS user_address,
              COALESCE(cp.total_points, 0::numeric) AS total_points,
              ua.details,
              ua.ens
             FROM user_address ua
               JOIN computed_points cp ON ua.id = cp.coalesced_user_address_id
          ), history_data AS (
           SELECT leaderboard_history.user_address_id,
              leaderboard_history.points_22h,
                  CASE
                      WHEN leaderboard_history.points_22h IS NULL THEN ( SELECT count(*) + 1
                         FROM leaderboard_history leaderboard_history_1
                        WHERE leaderboard_history_1.points_22h IS NOT NULL)
                      ELSE rank() OVER (ORDER BY (COALESCE(leaderboard_history.points_22h, 0::numeric)) DESC)
                  END AS rank_22h
             FROM leaderboard_history
          )
      SELECT rd."position",
             rd.rank,
             rd.user_address,
             rd.total_points,
             rd.details,
             rd.ens,
             COALESCE(hd.rank_22h, (SELECT count(*) + 1
                                    FROM history_data
                                    WHERE history_data.points_22h IS NOT NULL)) AS rank_22h,
             hd.points_22h
      FROM ranked_data rd
               LEFT JOIN history_data hd ON rd.user_address::text = hd.user_address_id::text
      ORDER BY rd.total_points DESC;
  `.execute(db)
}
