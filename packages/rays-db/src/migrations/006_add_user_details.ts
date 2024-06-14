import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>) {
  await db.schema.alterTable('user_address').addColumn('details', 'jsonb').execute()
  await db.schema.alterTable('user_address').addColumn('ens', 'varchar(255)').execute()
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
            position p ON pd.position_id = p.id
        GROUP BY 
            COALESCE(p.user_address_id, pd.user_address_id)
    )
    SELECT 
        ROW_NUMBER() OVER (ORDER BY total_points DESC) AS position,
        ua.address AS user_address,
        COALESCE(cp.total_points, 0) AS total_points,
        ua.details AS details,
        ua.ens AS ens
    FROM 
        user_address ua
    LEFT JOIN 
        computed_points cp ON ua.id = cp.coalesced_user_address_id        
    GROUP BY 
        ua.address, cp.total_points, ua.details, ua.ens
    ORDER BY 
        total_points DESC;
    
  `.execute(db)
}

export async function down(db: Kysely<never>) {
  await db.schema.alterTable('user_address').dropColumn('details').execute()
  await db.schema.alterTable('user_address').dropColumn('ens').execute()
  await sql`
    DROP MATERIALIZED VIEW IF EXISTS leaderboard;
    `.execute(db)
}
