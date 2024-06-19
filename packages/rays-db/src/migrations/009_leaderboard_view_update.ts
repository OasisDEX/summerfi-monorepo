import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>) {
  await sql`
    DROP MATERIALIZED VIEW IF EXISTS leaderboard;
  `.execute(db)
  await sql`
    CREATE MATERIALIZED VIEW leaderboard AS 
    WITH computed_points AS (
      SELECT 
          COALESCE(p.user_address_id, pd.user_address_id) AS coalesced_user_address_id,
          SUM(pd.points) AS total_points
      FROM 
          points_distribution pd
      LEFT JOIN 
          POSITION p ON pd.position_id = p.id
      GROUP BY 
          COALESCE(p.user_address_id, pd.user_address_id)
      HAVING 
          SUM(pd.points) > 0
    )
    SELECT 
        ROW_NUMBER() OVER (ORDER BY cp.total_points DESC) AS POSITION,
        ua.address AS user_address,
        COALESCE(cp.total_points, 0) AS total_points,
        ua.details AS details,
        ua.ens AS ens
    FROM 
        user_address ua
    INNER JOIN 
        computed_points cp ON ua.id = cp.coalesced_user_address_id
    ORDER BY 
        total_points DESC;
   
  `.execute(db)
}

export async function down(db: Kysely<never>) {
  await sql`
    DROP MATERIALIZED VIEW IF EXISTS leaderboard;
    `.execute(db)
}
