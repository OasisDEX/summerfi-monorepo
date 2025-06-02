import { Kysely, PostgresDialect, sql } from 'kysely'
import { DB } from 'kysely-codegen'
import { Pool } from 'pg'
import { ConfigService } from './config-updated'
import { KyselyMigrator } from './migrations/kysely-migrator'
import { Chain } from './types'

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
}
export class DatabaseService {
  protected pool: Pool
  protected db: Kysely<DB>
  public config: ConfigService

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
    this.pool = new Pool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'referral_points',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    })

    this.db = new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: this.pool,
      }),
    })

    this.config = new ConfigService(this.db)
  }

  async migrate(): Promise<void> {
    const migrator = new KyselyMigrator(this.pool)
    await migrator.runMigrations()
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
   * Validate if referral code exists in database or is internal referral code
   */
  private async validateReferralCode(referralCodeId: string): Promise<ReferralCodeType> {
    try {
      const parsedReferralCodeId = parseInt(referralCodeId)
      if (parsedReferralCodeId > 100 && parsedReferralCodeId < 2000000) {
        return ReferralCodeType.INTEGRATOR
      }
      const result = await this.db.executeQuery(
        sql`SELECT 1 FROM referral_codes WHERE id = ${referralCodeId} LIMIT 1`.compile(this.db),
      )
      return result.rows.length > 0 ? ReferralCodeType.USER : ReferralCodeType.INVALID
    } catch (error) {
      console.error('Error validating referral code:', error)
      return ReferralCodeType.INVALID
    }
  }

  /**
   * Create or update user with referral info
   */
  async upsertUser(
    userId: string,
    data: {
      referrerId?: string
      referralChain?: Chain
      referralTimestamp?: Date
    },
  ): Promise<void> {
    // Validate and decode referral code if provided
    let validatedReferrerId: string | null = null

    if (data.referrerId) {
      // referral code might be integer or hex string
      if (data.referrerId.startsWith('0x')) {
        const decodedReferralCode = this.decodeHexReferralCode(data.referrerId)
        if (decodedReferralCode !== null) {
          validatedReferrerId = decodedReferralCode.toString()
        }
      } else {
        validatedReferrerId = data.referrerId
      }

      if (validatedReferrerId !== null) {
        const referralCodeId = validatedReferrerId.toString()
        const referralCodeType = await this.validateReferralCode(referralCodeId)

        if (referralCodeType === ReferralCodeType.USER) {
          validatedReferrerId = referralCodeId
          console.log(`Valid referral code found: ${data.referrerId} -> ${referralCodeId}`)
        } else if (referralCodeType === ReferralCodeType.INTEGRATOR) {
          await this.ensureReferralCode(referralCodeId)
        } else {
          console.log(
            `Invalid referral code (not found in database): ${data.referrerId} -> ${referralCodeId}`,
          )
        }
      } else {
        console.log(`Invalid referral code format: ${data.referrerId} - skip processing user`)
        return
      }
    }

    await this.db
      .insertInto('users')
      .values({
        id: userId,
        referrer_id: validatedReferrerId,
        referral_chain: data.referralChain || null,
        referral_timestamp: data.referralTimestamp || null,
        is_active: false,
      })
      .onConflict((oc) => oc.doNothing())
      .execute()
  }

  /**
   * Update position state (idempotent)
   */
  async updatePosition(
    positionId: string,
    chain: Chain,
    userId: string,
    depositUsd: number,
    isVolatile: boolean,
  ): Promise<void> {
    // Referral rates:
    // – Stable Vaults (USDC, USDT, EURC etc): 7.5bps (5bps for referrer & 2.5bps for the receiver) per asset of TVL, annualised.
    // – Volatile Vaults (ETH etc): 4bps (2.5bps for referrer & 1.5bps for the receiver) per asset of TVL, annualised.
    // – Both of these would be calculated on a per second basis over the period.

    const feeTier = isVolatile ? 0.003 : 0.01
    const dailyFeeGeneratedByThePosition = (depositUsd * feeTier) / 365
    const dailyReferrerFees = dailyFeeGeneratedByThePosition * (isVolatile ? 0.00025 : 0.0005)
    const dailyOwnerFees = dailyFeeGeneratedByThePosition - dailyReferrerFees

    await this.db
      .insertInto('positions')
      .values({
        id: positionId,
        chain,
        user_id: userId,
        current_deposit_usd: depositUsd.toString(),
        fees_per_day_referrer: dailyReferrerFees.toString(),
        fees_per_day_owner: dailyOwnerFees.toString(),
        is_volatile: isVolatile,
        last_synced_at: new Date(),
      })
      .onConflict((oc) =>
        oc.columns(['id', 'chain']).doUpdateSet({
          current_deposit_usd: depositUsd.toString(),
          fees_per_day_referrer: dailyReferrerFees.toString(),
          fees_per_day_owner: dailyOwnerFees.toString(),
          last_synced_at: new Date(),
        }),
      )
      .execute()
  }

  /**
   * Update user activity status based on deposit threshold
   */
  async updateUserTotals(userId: string): Promise<void> {
    const config = await this.config.getConfig()

    await this.db.executeQuery(
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
    `.compile(this.db),
    )
  }

  /**
   * Recalculate all referral stats (fast single query)
   */
  async recalculateReferralStats(): Promise<void> {
    await this.db.executeQuery(
      sql`
      UPDATE referral_codes rc
      SET 
        active_users_count = COALESCE(stats.active_users, 0),
        total_deposits_usd = COALESCE(stats.total_deposits, '0'),
        updated_at = NOW()
      FROM (
        SELECT 
          u.referrer_id,
          COUNT(*) FILTER (WHERE u.is_active) as active_users,
          SUM(p.current_deposit_usd) as total_deposits
        FROM users u
        LEFT JOIN positions p ON u.id = p.user_id
        WHERE u.referrer_id IS NOT NULL
        GROUP BY u.referrer_id
      ) stats
      WHERE rc.id = stats.referrer_id
    `.compile(this.db),
    )
  }

  /**
   * Update daily rates and accumulate points + SUMR rewards
   */
  async updateDailyRatesAndPoints(): Promise<void> {
    const config = await this.config.getConfig()

    // update points per day - simplified without active users calculation
    await this.db.executeQuery(
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
      `.compile(this.db),
    )

    // Insert new point distributions
    await this.db.executeQuery(
      sql`
      INSERT INTO rewards_distributions (referral_id, amount, description, type)
      SELECT id, points_per_day / 24, 'REGULAR', 'POINTS' FROM referral_codes
      WHERE active_users_count > 0
    `.compile(this.db),
    )

    // Generate dynamic CASE statement from config
    const sumrCaseStatement = this.SUMR_REWARD_TIERS.map((tier) => {
      if (tier.maxAmount === Infinity) {
        return `ELSE total_deposits_usd * ${tier.percentage} / ${this.SUMR_TOKEN_PRICE_USD} / 8760`
      } else {
        return `WHEN total_deposits_usd <= ${tier.maxAmount} THEN total_deposits_usd * ${tier.percentage} / ${this.SUMR_TOKEN_PRICE_USD} / 8760`
      }
    }).join('\n          ')

    // Insert SUMR token distributions (hourly rate)
    await this.db.executeQuery(
      sql`
      INSERT INTO rewards_distributions (referral_id, amount, description, type)
      SELECT 
        id, 
        CASE 
          ${sql.raw(sumrCaseStatement)}
        END as hourly_sumr_rewards,
        'TIERED_SUMR_REWARDS', 
        'SUMMER_TOKENS' 
      FROM referral_codes
      WHERE active_users_count > 0 AND total_deposits_usd > 0
    `.compile(this.db),
    )

    // update summer per day and total summer earned
    const sumrUpdateCaseStatement = this.SUMR_REWARD_TIERS.map((tier) => {
      if (tier.maxAmount === Infinity) {
        return `ELSE total_deposits_usd * ${tier.percentage} / ${this.SUMR_TOKEN_PRICE_USD} / 8760`
      } else {
        return `WHEN total_deposits_usd <= ${tier.maxAmount} THEN total_deposits_usd * ${tier.percentage} / ${this.SUMR_TOKEN_PRICE_USD} / 8760`
      }
    }).join('\n        ')

    await this.db.executeQuery(
      sql`
      UPDATE referral_codes
      SET summer_per_day = CASE 
        ${sql.raw(sumrUpdateCaseStatement)}
      END,
      total_summer_earned = total_summer_earned + CASE 
        ${sql.raw(sumrUpdateCaseStatement)}
      END
      WHERE active_users_count > 0 AND total_deposits_usd > 0
    `.compile(this.db),
    )

    // update fees per day and total fees based on referred active users fees_per_day
    await this.db.executeQuery(
      sql`
      WITH referrer_fees AS (
        SELECT 
          u.referrer_id,
          SUM(p.fees_per_day_referrer) as total_daily_fees
        FROM users u
        INNER JOIN positions p ON u.id = p.user_id
        WHERE u.referrer_id IS NOT NULL AND u.is_active = true
        GROUP BY u.referrer_id
      )
      UPDATE referral_codes
      SET 
        fees_per_day = COALESCE(rf.total_daily_fees, 0),
        total_fees_earned = total_fees_earned + COALESCE(rf.total_daily_fees, 0) / 24
      FROM referrer_fees rf
      WHERE referral_codes.id = rf.referrer_id
      AND active_users_count > 0
    `.compile(this.db),
    )
    // do the same for the owner / user based on fees_per_day_owner in his positions
    await this.db.executeQuery(
      sql`
      WITH owner_fees AS (
        SELECT 
          u.id,
          SUM(p.fees_per_day_owner) as total_daily_fees
        FROM users u
        INNER JOIN positions p ON u.id = p.user_id
        WHERE u.is_active = true
        GROUP BY u.id
      )
      UPDATE referral_codes
      SET 
        fees_per_day = COALESCE(of.total_daily_fees, 0),
        total_fees_earned = total_fees_earned + COALESCE(of.total_daily_fees, 0) / 24
      FROM owner_fees of
      WHERE referral_codes.id = of.id
    `.compile(this.db),
    )

    // insert fees distributions (hourly rate)
    await this.db.executeQuery(
      sql`
      INSERT INTO rewards_distributions (referral_id, amount, description, type)
      SELECT 
        id, 
        COALESCE(fees_per_day, 0) / 24, 
        'FEES_DISTRIBUTION', 
        'FEES' 
      FROM referral_codes
      WHERE active_users_count > 0 AND COALESCE(fees_per_day, 0) > 0
    `.compile(this.db),
    )
  }

  /**
   * Update daily stats for historical tracking
   */
  async updateDailyStats(): Promise<void> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await this.db.executeQuery(
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
    `.compile(this.db),
    )
  }

  /**
   * Get processing checkpoint
   */
  async getLastProcessedTimestamp(): Promise<Date | null> {
    const result = await this.db
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

  /**
   * Get users referred by a referral code
   */
  async getUsersReferredBy(referrerId: string): Promise<SimplifiedUser[]> {
    const results = await this.db
      .selectFrom('users')
      .selectAll()
      .where('referrer_id', '=', referrerId)
      .execute()

    return results.map((row) => ({
      ...row,
      total_deposits_usd: Number(row.total_deposits_usd),
      created_at: row.created_at || new Date(),
      updated_at: row.updated_at || new Date(),
    }))
  }

  /**
   * Get active users referred by a referral code
   */
  async getActiveUsersReferredBy(referrerId: string): Promise<SimplifiedUser[]> {
    const results = await this.db
      .selectFrom('users')
      .selectAll()
      .where('referrer_id', '=', referrerId)
      .where('is_active', '=', true)
      .execute()

    return results.map((row) => ({
      ...row,
      total_deposits_usd: Number(row.total_deposits_usd),
      created_at: row.created_at || new Date(),
      updated_at: row.updated_at || new Date(),
    }))
  }

  /**
   * Get all referral codes with stats for leaderboard
   */
  async getTopReferralCodes(limit: number = 100): Promise<SimplifiedReferralCode[]> {
    const results = await this.db
      .selectFrom('referral_codes')
      .selectAll()
      .orderBy('total_points_earned', 'desc')
      .limit(limit)
      .execute()

    return results.map((row) => ({
      ...row,
      total_points_earned: Number(row.total_points_earned),
      total_deposits_usd: Number(row.total_deposits_usd),
      points_per_day: Number(row.points_per_day),
      fees_per_day: Number(row.fees_per_day),
      created_at: row.created_at || new Date(),
      updated_at: row.updated_at || new Date(),
    }))
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
   * Get or create referral code
   */
  async ensureReferralCode(id: string, customCode?: string): Promise<void> {
    await this.db
      .insertInto('referral_codes')
      .values({
        id,
        custom_code: customCode || null,
        total_points_earned: '0',
        total_deposits_usd: '0',
        active_users_count: 0,
        points_per_day: '0',
        fees_per_day: '0',
      })
      .onConflict((oc) => oc.column('id').doNothing())
      .execute()
  }
}
