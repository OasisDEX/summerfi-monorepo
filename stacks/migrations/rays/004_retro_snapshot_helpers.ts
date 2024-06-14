import { Kysely, sql } from 'kysely'
import * as console from 'node:console'

/**
 * @param db {Kysely<any>}
 */
export async function up(db: Kysely<never>) {
  await sql`CREATE OR REPLACE FUNCTION upsert_user_with_address(
    user_category VARCHAR,
    address_type address_type,
    address_to_insert TEXT
  ) RETURNS SETOF user_address AS $$
  DECLARE
    new_user_id INT;
    user_addr_row user_address%ROWTYPE;
  BEGIN
    -- Check if the user_address already exists
    SELECT * INTO user_addr_row
    FROM user_address
    WHERE address = address_to_insert;
    
    -- If the user_address exists, return it
    IF FOUND THEN
      RETURN NEXT user_addr_row;
      RETURN;
    END IF;
  
    -- If the user_address does not exist, insert a new user into blockchain_user
    INSERT INTO blockchain_user (category, created_at, updated_at)
    VALUES (user_category, NOW(), NOW())
    RETURNING id INTO new_user_id;
  
    -- Insert a new address for the new user
    INSERT INTO user_address (address, type, created_at, updated_at, user_id)
    VALUES (address_to_insert, address_type, NOW(), NOW(), new_user_id)
    RETURNING * INTO user_addr_row;
    
    -- Return the newly created user_address row
    RETURN NEXT user_addr_row;
  END;
  $$ LANGUAGE plpgsql;
  
  `.execute(db)
  await sql`CREATE OR REPLACE FUNCTION upsert_users_with_addresses(
        user_categories VARCHAR[],
        address_types address_type[],
        addresses TEXT[]
      ) RETURNS SETOF user_address AS $$
      DECLARE
        user_addr_row user_address%ROWTYPE;
      BEGIN
        -- Create a temporary table to hold the input data
        CREATE TEMPORARY TABLE temp_users_addresses (
          user_category VARCHAR,
          address_type address_type,
          address TEXT
        ) ON COMMIT DROP;
      
        -- Insert input data into the temporary table
        FOR i IN 1..array_length(addresses, 1) LOOP
          INSERT INTO temp_users_addresses (user_category, address_type, address)
          VALUES (user_categories[i], address_types[i], addresses[i]);
        END LOOP;
      
        -- Perform the upsert operation using the temporary table
        RETURN QUERY
        WITH existing AS (
          SELECT ua.*
          FROM user_address ua
          JOIN temp_users_addresses src
          ON ua.address = src.address
        ), inserted_users AS (
          INSERT INTO blockchain_user (category, created_at, updated_at)
          SELECT DISTINCT src.user_category, NOW(), NOW()
          FROM temp_users_addresses src
          LEFT JOIN user_address ua ON ua.address = src.address
          WHERE ua.address IS NULL
          RETURNING id, category
        ), inserted_addresses AS (
          INSERT INTO user_address (address, type, created_at, updated_at, user_id)
          SELECT src.address, src.address_type, NOW(), NOW(), iu.id
          FROM temp_users_addresses src
          JOIN inserted_users iu ON iu.category = src.user_category
          ON CONFLICT (address) DO UPDATE
          SET type = EXCLUDED.type,
              updated_at = NOW()
          RETURNING *
        )
        SELECT * FROM existing
        UNION ALL
        SELECT * FROM inserted_addresses;
      END;
      $$ LANGUAGE plpgsql;
      
  `.execute(db)

  await sql`CREATE OR REPLACE FUNCTION upsert_points_distributions(
        types VARCHAR[],
        descriptions VARCHAR[],
        points_to_insert DECIMAL[],
        user_address_ids INTEGER[],
        eligibility_condition_ids INTEGER[]
      ) RETURNS SETOF points_distribution AS $$
      BEGIN
        -- Create a temporary table to hold the input data
        CREATE TEMPORARY TABLE temp_points_distributions (
            type VARCHAR,
            description VARCHAR,
            points DECIMAL,
            user_address_id INTEGER,
            eligibility_condition_id INTEGER
          ) ON COMMIT DROP;
        
      
        -- Insert input data into the temporary table
        FOR i IN 1..array_length(types, 1) LOOP
          INSERT INTO temp_points_distributions (type, description, points, user_address_id, eligibility_condition_id)
          VALUES (types[i], descriptions[i], points_to_insert[i], user_address_ids[i], eligibility_condition_ids[i]);
        END LOOP;
      
        -- Perform the upsert operation using the temporary table
        RETURN QUERY
        WITH updated AS (
          UPDATE points_distribution pd
          SET
            points = src.points,
            description = src.description,
            eligibility_condition_id = src.eligibility_condition_id,
            updated_at = NOW()
          FROM temp_points_distributions AS src
          WHERE pd.type = src.type
            AND pd.user_address_id = src.user_address_id
          RETURNING pd.*
        )
        INSERT INTO points_distribution (type, description, points, user_address_id, eligibility_condition_id, created_at, updated_at)
        SELECT type, description, points, user_address_id, eligibility_condition_id, NOW(), NOW()
        FROM temp_points_distributions AS src
        WHERE NOT EXISTS (
          SELECT 1
          FROM points_distribution pd
          WHERE pd.type = src.type
            AND pd.user_address_id = src.user_address_id
        )
        RETURNING *;
      END;
      $$ LANGUAGE plpgsql;
      
  `.execute(db)
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db: Kysely<never>) {
  console.log(`Dropping function upsert_points_distributions`)
  await sql`DROP FUNCTION IF EXISTS upsert_points_distributions`.execute(db)
  console.log(`Dropping function upsert_users_with_addresses`)
  await sql`DROP FUNCTION IF EXISTS upsert_user_with_address`.execute(db)
  console.log(`Dropping function upsert_users_with_addresses`)
  await sql`DROP FUNCTION IF EXISTS upsert_users_with_addresses`.execute(db)
}
