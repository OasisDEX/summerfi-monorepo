import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<never>) {
 await sql`
   CREATE OR REPLACE FUNCTION take_tge_snapshot()
   RETURNS void
   LANGUAGE plpgsql AS $function$
   DECLARE
     total_sum numeric;
     existing_count integer;
   BEGIN
     SELECT COUNT(*) INTO existing_count FROM snapshot WHERE name = 'tge';
     IF existing_count > 0 THEN
       RAISE EXCEPTION 'tge snapshot already exists';
     END IF;
     
     
     SELECT SUM(l.total_points) INTO total_sum FROM leaderboard_new l;
     
     IF total_sum = 0 THEN
     	RAISE EXCEPTION 'Total points sum is zero, cannot compute sumr_awarded';
	  END IF;
     
     INSERT INTO snapshot (user_address_id, points, sumr_awarded, name)
     SELECT 
       ua.id,
       l.total_points,
       (l.total_points / total_sum) * 40100000 as sumr_awarded,
       'tge'
     FROM leaderboard_new l
     JOIN user_address ua ON ua.address = l.user_address;
   END;
   $function$
 `.execute(db)
}

export async function down(db: Kysely<never>) {
 await sql`DROP FUNCTION IF EXISTS take_tge_snapshot`.execute(db)
}
