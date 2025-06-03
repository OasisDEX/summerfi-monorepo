import { Kysely, PostgresDialect, sql } from 'kysely'
import { DB } from 'kysely-codegen'
import { Pool } from 'pg'
import { ConfigService, PointsConfig } from './config'
import { KyselyMigrator } from './migrations/kysely-migrator'
import { Logger } from '@aws-lambda-powertools/logger'
import { Network } from './types'
import * as dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({ path: path.join(__dirname, '../../../.env') })

export type PositionUpdate = {
  id: string
  chain: string
  user_id: string
  current_deposit_usd: string
  fees_per_day_referrer: string
  fees_per_day_owner: string
  is_volatile: boolean
  last_synced_at: Date
}

export interface SimplifiedReferralCode {
  id: string
  custom_code: string | null
  total_points_earned: number
  total_deposits_usd: number
  active_users_count: number
  points_per_day: number
  fees_per_day: number
  last_calculated_at: Date | null
  created_at: Date
  updated_at: Date
}

export interface SimplifiedUser {
  id: string
  referrer_id: string | null
  referral_chain: string | null
  referral_timestamp: Date | null
  total_deposits_usd: number
  is_active: boolean
  last_activity_at: Date | null
  created_at: Date
  updated_at: Date
}

export interface SimplifiedPosition {
  id: string
  chain: string
  user_id: string
  current_deposit_usd: number
  last_synced_at: Date | null
}
enum ReferralCodeType {
  USER = 'user',
  INTEGRATOR = 'integrator',
  INVALID = 'invalid',
  TEST = 'test',
}

enum RewardType {
  FEES = 'fees',
  POINTS = 'points',
  SUMR = 'summer_tokens',
}

enum RewardDescription {
  REGULAR = 'regular_distribution',
  BONUS = 'bonus',
  CLAIM = 'claim',
}

export class DatabaseService {
  protected pool: Pool
  protected db: Kysely<DB>
  public config: ConfigService
  public migrator: KyselyMigrator | null = null
  public logger: Logger

  // SUMR token price in USD
  private readonly SUMR_TOKEN_PRICE_USD = 0.25

  // SUMR rewards tiers configuration
  private readonly SUMR_REWARD_TIERS = [
    { maxAmount: 10000, percentage: 0.001 }, // 0.1%
    { maxAmount: 100000, percentage: 0.002 }, // 0.2%
    { maxAmount: 250000, percentage: 0.003 }, // 0.3%
    { maxAmount: 500000, percentage: 0.004 }, // 0.4%
    { maxAmount: Infinity, percentage: 0.005 }, // 0.5%
  ]

  constructor() {
    this.logger = new Logger({ serviceName: 'db' })
    const BEACH_CLUB_REWARDS_DB_CONNECTION_STRING =
      process.env.BEACH_CLUB_REWARDS_DB_CONNECTION_STRING
    if (!BEACH_CLUB_REWARDS_DB_CONNECTION_STRING) {
      throw new Error('BEACH_CLUB_REWARDS_DB_CONNECTION_STRING is not set')
    }

    const url = new URL(BEACH_CLUB_REWARDS_DB_CONNECTION_STRING)
    const host = url.hostname
    const port = url.port
    const database = url.pathname.slice(1)
    const user = url.username
    const password = url.password

    this.pool = new Pool({
      host,
      port: parseInt(port),
      database,
      user,
      password,
    })

    this.db = new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: this.pool,
      }),
    })

    this.config = new ConfigService(this.db, new Logger({ serviceName: 'config' }))
  }
  async setMigrator(): Promise<void> {
    if (!this.migrator) {
      this.migrator = new KyselyMigrator(this.pool)
    }
  }

  async migrate(): Promise<void> {
    if (!this.migrator) {
      await this.setMigrator()
    }
    await this.migrator!.runMigrations()
  }

  async resetMigrations(): Promise<void> {
    if (!this.migrator) {
      await this.setMigrator()
    }
    await this.migrator!.reset()
  }

  async rollbackMigrations(): Promise<void> {
    if (!this.migrator) {
      await this.setMigrator()
    }
    await this.migrator!.rollbackMigrations()
  }

  /**
   * Utility Operations
   */
  async hasAnyData(): Promise<boolean> {
    const result = await this.db
      .selectFrom('users')
      .select((eb) => eb.fn.count('id').as('count'))
      .executeTakeFirst()

    return (result?.count as any) > 0
  }

  /**
   * Decode hex referral code to integer
   */
  private decodeHexReferralCode(hexCode: string): number | null {
    try {
      // Remove 0x prefix if present
      const cleanHex = hexCode.startsWith('0x') ? hexCode.slice(2) : hexCode
      // search for the hex value in the string as it might have zeroes padded
      // Convert hex to BigInt then to number
      const decoded = parseInt(cleanHex, 16)
      // Validate it's a reasonable number (not 0, not too large)
      if (decoded === 0 || decoded > Number.MAX_SAFE_INTEGER) {
        return null
      }
      return decoded
    } catch (error) {
      console.error('Error decoding hex referral code:', error)
      return null
    }
  }

  /**
   * Validate if referral code exists in database or is integrator referral code
   */
  private async validateReferralCode(referralCodeId: string): Promise<string | null> {
    try {
      const parsedReferralCodeId = parseInt(referralCodeId)
      if (parsedReferralCodeId > 100 && parsedReferralCodeId < 2000000) {
        await this.ensureReferralCode(referralCodeId, ReferralCodeType.INTEGRATOR)
        return referralCodeId
      }
      if (parsedReferralCodeId >= 0 && parsedReferralCodeId < 100) {
        await this.ensureReferralCode(referralCodeId, ReferralCodeType.TEST)
        return referralCodeId
      }
      const result = await this.db.executeQuery(
        sql`SELECT 1 FROM referral_codes WHERE id = ${referralCodeId} LIMIT 1`.compile(this.db),
      )
      return result.rows.length > 0 ? referralCodeId : null
    } catch (error) {
      console.error('Error validating referral code:', error)
      return null
    }
  }

  /**
   * Create or update user with referral info
   */
  async upsertUser(
    userId: string,
    data: {
      referrerId?: string
      referralChain?: Network
      referralTimestamp?: Date
    },
  ): Promise<void> {
    // Validate and decode referral code if provided
    let validatedReferrerId: string | null = null

    if (data.referrerId) {
      const referralCodeId = data.referrerId
      validatedReferrerId = await this.validateReferralCode(referralCodeId)
      console.log('validatedReferrerId', validatedReferrerId)
    }

    await this.db
      .insertInto('users')
      .values({
        id: userId,
        referrer_id: validatedReferrerId,
        referral_chain: validatedReferrerId ? data.referralChain : null,
        referral_timestamp: validatedReferrerId ? data.referralTimestamp : null,
        is_active: false,
      })
      .onConflict((oc) => oc.doNothing())
      .execute()
  }

  async updatePositionsInTransaction(
    trx: Kysely<DB>,
    positionUpdates: PositionUpdate[],
  ): Promise<void> {
    await trx
      .insertInto('positions')
      .values(positionUpdates)
      .onConflict((oc: any) =>
        oc.columns(['id', 'chain']).doUpdateSet({
          current_deposit_usd: (eb: any) => eb.ref('excluded.current_deposit_usd'),
          fees_per_day_referrer: (eb: any) => eb.ref('excluded.fees_per_day_referrer'),
          fees_per_day_owner: (eb: any) => eb.ref('excluded.fees_per_day_owner'),
          last_synced_at: (eb: any) => eb.ref('excluded.last_synced_at'),
        }),
      )
      .execute()
  }

  /**
   * Update user activity status based on deposit threshold
   */
  async updateUserTotalsInTransaction(
    trx: Kysely<DB>,
    userIds: string[],
    config: PointsConfig,
  ): Promise<void> {
    for (const userId of userIds) {
      await trx.executeQuery(
        sql`
      UPDATE users 
      SET 
        is_active = (
          SELECT COALESCE(SUM(current_deposit_usd), 0) >= ${config.activeUserThresholdUsd}
          FROM positions 
          WHERE user_id = ${userId}
        ),
        last_activity_at = NOW()
      WHERE id = ${userId}
    `.compile(trx),
      )
    }
  }

  /**
   * Recalculate all referral stats within a transaction
   */
  async recalculateReferralStatsInTransaction(trx: Kysely<DB>): Promise<void> {
    await trx.executeQuery(
      sql`
      UPDATE referral_codes rc
      SET 
        active_users_count = COALESCE(stats.active_users, 0),
        total_deposits_usd = COALESCE(stats.total_deposits, '0'),
        updated_at = NOW()
      FROM (
        SELECT 
          u.referrer_id,
          COUNT(DISTINCT u.id) FILTER (WHERE u.is_active = true) as active_users,
          SUM(p.current_deposit_usd) as total_deposits
        FROM users u
        LEFT JOIN positions p ON u.id = p.user_id
        WHERE u.referrer_id IS NOT NULL
        GROUP BY u.referrer_id
      ) stats
      WHERE rc.id = stats.referrer_id
    `.compile(trx),
    )
  }

  /**
   * Update daily rates and accumulate points within a transaction
   */
  async updateDailyRatesAndPointsInTransaction(trx: Kysely<DB>): Promise<void> {
    const config = await this.config.getConfig()

    // update points per day - simplified without active users calculation
    await trx.executeQuery(
      sql`
      UPDATE referral_codes rc
      SET 
        points_per_day = rc.total_deposits_usd * (${config.pointsFormulaBase} + ${config.pointsFormulaLogMultiplier} * ln(COALESCE(rc.active_users_count, 0) + 1)),
        -- Accumulate points (hourly rate)
        total_points_earned = rc.total_points_earned + (
          rc.total_deposits_usd * (${config.pointsFormulaBase} + ${config.pointsFormulaLogMultiplier} * ln(COALESCE(rc.active_users_count, 0) + 1)) / 24
        ),
        last_calculated_at = NOW()
      WHERE rc.active_users_count > 0
      `.compile(trx),
    )

    // Insert new point distributions
    await trx.executeQuery(
      sql`
      INSERT INTO rewards_distributions (referral_id, amount, description, type)
      SELECT id, points_per_day / 24, ${RewardDescription.REGULAR}, ${RewardType.POINTS} FROM referral_codes
      WHERE active_users_count > 0
    `.compile(trx),
    )

    const sumrCaseStatement = this.SUMR_REWARD_TIERS.map((tier) => {
      if (tier.maxAmount === Infinity) {
        return `ELSE total_deposits_usd * ${tier.percentage} / ${this.SUMR_TOKEN_PRICE_USD} / 8760`
      } else {
        return `WHEN total_deposits_usd <= ${tier.maxAmount} THEN total_deposits_usd * ${tier.percentage} / ${this.SUMR_TOKEN_PRICE_USD} / 8760`
      }
    }).join('\n          ')

    // Insert SUMR token distributions (hourly rate)
    await trx.executeQuery(
      sql`
      INSERT INTO rewards_distributions (referral_id, amount, description, type)
      SELECT 
        id, 
        CASE 
          ${sql.raw(sumrCaseStatement)}
        END as hourly_sumr_rewards,
        ${RewardDescription.REGULAR}, 
        ${RewardType.SUMR} 
      FROM referral_codes
      WHERE active_users_count > 0 AND total_deposits_usd > 0
    `.compile(trx),
    )

    // update summer per day and total summer earned
    const sumrUpdateCaseStatement = this.SUMR_REWARD_TIERS.map((tier) => {
      if (tier.maxAmount === Infinity) {
        return `ELSE total_deposits_usd * ${tier.percentage} / ${this.SUMR_TOKEN_PRICE_USD} / 8760`
      } else {
        return `WHEN total_deposits_usd <= ${tier.maxAmount} THEN total_deposits_usd * ${tier.percentage} / ${this.SUMR_TOKEN_PRICE_USD} / 8760`
      }
    }).join('\n        ')

    await trx.executeQuery(
      sql`
      UPDATE referral_codes
      SET summer_per_day = CASE 
        ${sql.raw(sumrUpdateCaseStatement)}
      END,
      total_summer_earned = total_summer_earned + CASE 
        ${sql.raw(sumrUpdateCaseStatement)}
      END,
      last_calculated_at = NOW()
      WHERE active_users_count > 0 AND total_deposits_usd > 0
    `.compile(trx),
    )
    await trx.executeQuery(
      sql`
      WITH daily_referrer_fees_by_code AS (
        -- Calculate total daily fees earned by codes as referrers
        SELECT
          u.referrer_id as referral_code_id,
          SUM(p.fees_per_day_referrer) as total_daily_referrer_fees
        FROM users u
        INNER JOIN positions p ON u.id = p.user_id
        WHERE u.referrer_id IS NOT NULL AND u.is_active = true
        GROUP BY u.referrer_id
      ),
      daily_owner_fees_by_code AS (
        -- Calculate total daily fees earned by codes for their owner's positions
        SELECT
          u.referral_code as referral_code_id,
          SUM(p.fees_per_day_owner) as total_daily_owner_fees
        FROM users u
        INNER JOIN positions p ON u.id = p.user_id
        WHERE u.referral_code IS NOT NULL AND u.is_active = true -- User must have a code and be active
        GROUP BY u.referral_code
      ),
      target_referral_codes_for_update AS (
        -- Define all referral codes that should be processed:
        -- 1. Codes that have referred active users.
        SELECT id FROM referral_codes WHERE active_users_count > 0
        UNION
        -- 2. Codes belonging to active users (for owner fees), ensuring the code exists.
        SELECT u.referral_code FROM users u WHERE u.is_active = true AND u.referral_code IS NOT NULL
      ),
      all_calculated_daily_fees AS (
        -- Combine both fee types for all targeted referral codes.
        -- This ensures that if a code earns 0 fees today (but is in the target list), 
        -- its fees_per_day is correctly set to 0.
        SELECT
          target_rc.id as referral_code_id,
          COALESCE(drf.total_daily_referrer_fees, 0) as daily_referrer_component,
          COALESCE(dof.total_daily_owner_fees, 0) as daily_owner_component,
          (COALESCE(drf.total_daily_referrer_fees, 0) + COALESCE(dof.total_daily_owner_fees, 0)) as final_total_daily_fees
        FROM
          target_referral_codes_for_update target_rc
        LEFT JOIN daily_referrer_fees_by_code drf ON target_rc.id = drf.referral_code_id
        LEFT JOIN daily_owner_fees_by_code dof ON target_rc.id = dof.referral_code_id
      )
      UPDATE referral_codes rc
      SET
        fees_per_day = acdf.final_total_daily_fees,
        total_fees_earned = rc.total_fees_earned + (acdf.final_total_daily_fees / 24), -- Accumulate total
        last_calculated_at = NOW()
      FROM all_calculated_daily_fees acdf
      WHERE rc.id = acdf.referral_code_id;
    `.compile(trx),
    )

    // insert fees distributions (hourly rate)
    await trx.executeQuery(
      sql`
      INSERT INTO rewards_distributions (referral_id, amount, description, type)
      SELECT 
        id, 
        COALESCE(fees_per_day, 0) / 24, 
        ${RewardDescription.REGULAR}, 
        ${RewardType.FEES} 
      FROM referral_codes
      WHERE active_users_count > 0 AND COALESCE(fees_per_day, 0) / 24 > 0
    `.compile(trx),
    )
  }

  /**
   * Update daily stats within a transaction
   */
  async updateDailyStatsInTransaction(trx: Kysely<DB>): Promise<void> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await trx.executeQuery(
      sql`
      INSERT INTO daily_stats (referral_id, date, points_earned, active_users, total_deposits)
      SELECT 
        id as referral_id,
        ${today}::date as date,
        points_per_day as points_earned,
        active_users_count as active_users,
        total_deposits_usd as total_deposits
      FROM referral_codes
      WHERE active_users_count > 0
      ON CONFLICT (referral_id, date) 
      DO UPDATE SET
        points_earned = EXCLUDED.points_earned,
        active_users = EXCLUDED.active_users,
        total_deposits = EXCLUDED.total_deposits
    `.compile(trx),
    )
  }

  /**
   * Get processing checkpoint
   */
  async getLastProcessedTimestampInTransaction(trx: Kysely<DB> | undefined): Promise<Date | null> {
    const result = await (trx || this.db)
      .selectFrom('processing_checkpoint')
      .select('last_processed_timestamp')
      .orderBy('id', 'desc')
      .limit(1)
      .executeTakeFirst()

    return result?.last_processed_timestamp || null
  }

  /**
   * Update processing checkpoint
   */
  async updateProcessingCheckpoint(timestamp: Date): Promise<void> {
    await this.db
      .insertInto('processing_checkpoint')
      .values({
        last_processed_timestamp: timestamp,
      })
      .execute()
  }

  /**
   * Get referral code with stats
   */
  async getReferralCode(id: string): Promise<SimplifiedReferralCode | null> {
    const result = await this.db
      .selectFrom('referral_codes')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()

    if (!result) return null

    return {
      ...result,
      total_points_earned: Number(result.total_points_earned),
      total_deposits_usd: Number(result.total_deposits_usd),
      points_per_day: Number(result.points_per_day),
      fees_per_day: Number(result.fees_per_day),
      created_at: result.created_at || new Date(),
      updated_at: result.updated_at || new Date(),
    }
  }

  async requiresMigration(): Promise<boolean> {
    try {
      const result = await this.db
        .selectFrom('points_config')
        .select(['key', 'value'])
        .where('key', '=', 'run_migrations')
        .executeTakeFirst()
      return result?.value === 'true'
    } catch (error) {
      console.error('Db not initialized:', error)
      return true
    }
  }

  async close(): Promise<void> {
    await this.db.destroy()
  }

  get rawDb() {
    return this.db
  }

  get rawPool() {
    return this.pool
  }

  /**
   * Execute operations within a transaction
   */
  async executeInTransaction<T>(callback: (trx: Kysely<DB>) => Promise<T>): Promise<T> {
    return await this.db.transaction().execute(callback)
  }

  /**
   * Get or create referral code
   */
  async ensureReferralCode(id: string, type: ReferralCodeType, customCode?: string): Promise<void> {
    await this.db
      .insertInto('referral_codes')
      .values({
        id,
        custom_code: customCode || null,
        type,
        total_points_earned: '0',
        total_deposits_usd: '0',
        active_users_count: 0,
        points_per_day: '0',
        fees_per_day: '0',
      })
      .onConflict((oc) => oc.column('id').doNothing())
      .execute()
  }

  /**
   * Validate referral code within a transaction
   */
  async validateReferralCodeInTransaction(
    trx: Kysely<DB>,
    referralCodeId: string,
  ): Promise<string | null> {
    try {
      const parsedReferralCodeId = parseInt(referralCodeId)
      if (parsedReferralCodeId > 100 && parsedReferralCodeId < 2000000) {
        await this.ensureReferralCodeInTransaction(trx, referralCodeId, ReferralCodeType.INTEGRATOR)
        return referralCodeId
      }
      if (parsedReferralCodeId >= 0 && parsedReferralCodeId < 100) {
        await this.ensureReferralCodeInTransaction(trx, referralCodeId, ReferralCodeType.TEST)
        return referralCodeId
      }
      const result = await trx.executeQuery(
        sql`SELECT 1 FROM referral_codes WHERE id = ${referralCodeId} LIMIT 1`.compile(trx),
      )
      return result.rows.length > 0 ? referralCodeId : null
    } catch (error) {
      console.error('Error validating referral code:', error)
      return null
    }
  }

  /**
   * Ensure referral code exists within a transaction
   */
  async ensureReferralCodeInTransaction(
    trx: Kysely<DB>,
    id: string,
    type: ReferralCodeType,
    customCode?: string,
  ): Promise<void> {
    await trx
      .insertInto('referral_codes')
      .values({
        id,
        custom_code: customCode || null,
        type,
        total_points_earned: '0',
        total_deposits_usd: '0',
        active_users_count: 0,
        points_per_day: '0',
        fees_per_day: '0',
      })
      .onConflict((oc: any) => oc.column('id').doNothing())
      .execute()
  }
}
