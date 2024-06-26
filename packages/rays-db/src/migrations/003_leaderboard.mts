import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>) {
    await sql`
    CREATE VIEW leaderboard AS
    SELECT 
        ROW_NUMBER() OVER (ORDER BY total_points DESC) AS position,
        user_address,
        total_points
    FROM 
        (
            SELECT 
                ua.address AS user_address,
                COALESCE(SUM(cp.total_points), 0) AS total_points
            FROM 
                user_address ua
            LEFT JOIN 
                (
                    SELECT 
                        COALESCE(p.user_address_id, pd.user_address_id) AS user_address_id,
                        SUM(pd.points) AS total_points
                    FROM 
                        points_distribution pd
                    LEFT JOIN 
                        position p ON pd.position_id = p.id
                    GROUP BY 
                        COALESCE(p.user_address_id, pd.user_address_id)
                ) AS cp ON ua.id = cp.user_address_id
            GROUP BY 
                ua.address
        ) AS leaderboard
    WHERE 
        total_points IS NOT NULL
    ORDER BY 
        total_points DESC;
  `.execute(db)
}

export async function down(db: Kysely<never>) {
    await sql`
    DROP VIEW IF EXISTS leaderboard;
  `.execute(db)
}