import { Kysely, sql } from 'kysely'

import { ConfigService, PointsConfig } from './config'
import { Logger } from '@aws-lambda-powertools/logger'
import { getBeachClubDb, DB } from '@summerfi/summer-beach-club-db'
import * as dotenv from 'dotenv'
import path from 'node:path'
import {
  PositionUpdate,
  RewardCurrency,
  RewardDescription,
  SimplifiedReferralCode,
  RewardsBalance,
  ReferralCodeType,
} from './types'

dotenv.config({ path: path.join(__dirname, '../../../.env') })

export class DatabaseService {
  protected db: Kysely<DB>
  public config: ConfigService
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

    this.db = getBeachClubDb({
      connectionString: BEACH_CLUB_REWARDS_DB_CONNECTION_STRING,
    }).db

    this.config = new ConfigService(this.db, new Logger({ serviceName: 'config' }))
  }

  /**
   * Utility Operations
   */
  async hasAnyData(): Promise<boolean> {
    const result = await this.db
      .selectFrom('users')
      .select((eb) => eb.fn.count('id').as('count'))
      .executeTakeFirst()

    return (result?.count ? Number(result.count) : 0) > 0
  }

  async updatePositionsInTransaction(
    trx: Kysely<DB>,
    positionUpdates: PositionUpdate[],
  ): Promise<void> {
    await trx
      .insertInto('positions')
      .values(positionUpdates)
      .onConflict((oc) =>
        oc.columns(['id', 'chain']).doUpdateSet({
          current_deposit_usd: (eb) => eb.ref('excluded.current_deposit_usd'),
          current_deposit_asset: (eb) => eb.ref('excluded.current_deposit_asset'),
          currency_symbol: (eb) => eb.ref('excluded.currency_symbol'),
          fees_per_day_referrer: (eb) => eb.ref('excluded.fees_per_day_referrer'),
          fees_per_day_owner: (eb) => eb.ref('excluded.fees_per_day_owner'),
          fees_per_day_referrer_usd: (eb) => eb.ref('excluded.fees_per_day_referrer_usd'),
          fees_per_day_owner_usd: (eb) => eb.ref('excluded.fees_per_day_owner_usd'),
          last_synced_at: (eb) => eb.ref('excluded.last_synced_at'),
        }),
      )
      .execute()
  }

  /**
   * Update user activity status based on deposit threshold
   */
  async updateUsersIsActiveFlag(
    trx: Kysely<DB>,
    userIds: string[],
    config: PointsConfig,
  ): Promise<void> {
    if (userIds.length === 0) {
      return // No users to update
    }

    await trx.executeQuery(
      sql`
     UPDATE users u
SET 
  is_active = (
    SELECT COALESCE(SUM(p.current_deposit_usd), 0) >= ${config.activeUserThresholdUsd}
    FROM positions p
    WHERE p.user_id = u.id -- Correlated subquery
  ),
  last_activity_at = NOW()
WHERE u.id = ANY(${userIds});
    `.compile(trx),
    )
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
        total_deposits_referred_usd = COALESCE(stats.total_deposits, '0'),
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

    // Generate unique batch ID for this processing run
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // 1. Calculate and distribute points for all referral codes with active users
    await trx.executeQuery(
      sql`
      WITH hourly_points_distributions AS (
        SELECT 
          rc.id as referral_code_id,
          ${RewardCurrency.POINTS} as currency,
          (rc.total_deposits_referred_usd * (${config.pointsFormulaBase} + ${config.pointsFormulaLogMultiplier} * ln(COALESCE(rc.active_users_count, 0) + 1))) / 24 as hourly_amount,
          rc.total_deposits_referred_usd * (${config.pointsFormulaBase} + ${config.pointsFormulaLogMultiplier} * ln(COALESCE(rc.active_users_count, 0) + 1)) as daily_amount
        FROM referral_codes rc
        WHERE rc.active_users_count > 0
      )
      -- Insert distribution records first
      INSERT INTO rewards_distributions (batch_id, referral_code_id, currency, amount, description)
      SELECT 
        ${batchId},
        referral_code_id,
        currency,
        hourly_amount,
        ${RewardDescription.REGULAR}
      FROM hourly_points_distributions
      WHERE hourly_amount > 0
    `.compile(trx),
    )

    // Update balances for points based on distributions
    await trx.executeQuery(
      sql`
      INSERT INTO rewards_balances (referral_code_id, currency, balance, amount_per_day, total_earned)
      SELECT 
        rd.referral_code_id,
        rd.currency,
        SUM(rd.amount) as hourly_amount,
        SUM(rd.amount) * 24 as daily_amount,
        SUM(rd.amount) as hourly_amount
      FROM rewards_distributions rd
      WHERE rd.currency = ${RewardCurrency.POINTS}
        AND rd.description = ${RewardDescription.REGULAR}
        AND rd.batch_id = ${batchId}
      GROUP BY rd.referral_code_id, rd.currency
      ON CONFLICT (referral_code_id, currency) 
      DO UPDATE SET
        balance = rewards_balances.balance + EXCLUDED.balance,
        amount_per_day = EXCLUDED.amount_per_day,
        total_earned = rewards_balances.total_earned + EXCLUDED.balance,
        updated_at = NOW()
    `.compile(trx),
    )

    // 2. Calculate and distribute SUMR rewards for all referral codes with active users
    const sumrCaseStatement = this.SUMR_REWARD_TIERS.map((tier) => {
      if (tier.maxAmount === Infinity) {
        return `ELSE rc.total_deposits_referred_usd * ${tier.percentage} / ${this.SUMR_TOKEN_PRICE_USD} / 8760`
      } else {
        return `WHEN rc.total_deposits_referred_usd <= ${tier.maxAmount} THEN rc.total_deposits_referred_usd * ${tier.percentage} / ${this.SUMR_TOKEN_PRICE_USD} / 8760`
      }
    }).join('\n          ')

    await trx.executeQuery(
      sql`
      WITH hourly_sumr_distributions AS (
        SELECT 
          rc.id as referral_code_id,
          ${RewardCurrency.SUMR} as currency,
          CASE 
            ${sql.raw(sumrCaseStatement)}
          END as hourly_amount,
          CASE 
            ${sql.raw(sumrCaseStatement)}
          END * 24 as daily_amount
        FROM referral_codes rc
        WHERE rc.active_users_count > 0 AND rc.total_deposits_referred_usd > 0
      )
      -- Insert distribution records first
      INSERT INTO rewards_distributions (batch_id, referral_code_id, currency, amount, description)
      SELECT 
        ${batchId},
        referral_code_id,
        currency,
        hourly_amount,
        ${RewardDescription.REGULAR}
      FROM hourly_sumr_distributions
      WHERE hourly_amount > 0
    `.compile(trx),
    )

    // Update balances for SUMR based on distributions
    await trx.executeQuery(
      sql`
      INSERT INTO rewards_balances (referral_code_id, currency, balance, amount_per_day, total_earned)
      SELECT 
        rd.referral_code_id,
        rd.currency,
        SUM(rd.amount) as hourly_amount,
        SUM(rd.amount) * 24 as daily_amount,
        SUM(rd.amount) as hourly_amount
      FROM rewards_distributions rd
      WHERE rd.currency = ${RewardCurrency.SUMR}
        AND rd.description = ${RewardDescription.REGULAR}
        AND rd.batch_id = ${batchId}
      GROUP BY rd.referral_code_id, rd.currency
      ON CONFLICT (referral_code_id, currency) 
      DO UPDATE SET
        balance = rewards_balances.balance + EXCLUDED.balance,
        amount_per_day = EXCLUDED.amount_per_day,
        total_earned = rewards_balances.total_earned + EXCLUDED.balance,
        updated_at = NOW()
    `.compile(trx),
    )

    // 3. Calculate and distribute fee rewards for referral codes
    await trx.executeQuery(
      sql`
      WITH daily_referrer_fees_by_code_currency AS (
        -- Calculate total daily fees earned by codes as referrers, grouped by currency
        SELECT
          u.referrer_id as referral_code_id,
          p.currency_symbol,
          SUM(p.fees_per_day_referrer) as total_daily_referrer_fees,
          SUM(p.fees_per_day_referrer_usd) as total_daily_referrer_fees_usd
        FROM users u
        INNER JOIN positions p ON u.id = p.user_id
        WHERE u.referrer_id IS NOT NULL AND u.is_active = true
        GROUP BY u.referrer_id, p.currency_symbol
      ),
      daily_owner_fees_by_code_currency AS (
        -- Calculate total daily fees earned by codes for their owner's positions, grouped by currency
        SELECT
          u.referral_code as referral_code_id,
          p.currency_symbol,
          SUM(p.fees_per_day_owner) as total_daily_owner_fees,
          SUM(p.fees_per_day_owner_usd) as total_daily_owner_fees_usd
        FROM users u
        INNER JOIN positions p ON u.id = p.user_id
        WHERE u.referral_code IS NOT NULL AND u.is_active = true
        GROUP BY u.referral_code, p.currency_symbol
      ),
      hourly_fee_distributions AS (
        -- Combine both fee types for all referral codes by currency
        SELECT
          COALESCE(drf.referral_code_id, dof.referral_code_id) as referral_code_id,
          COALESCE(drf.currency_symbol, dof.currency_symbol) as currency_symbol,
          (COALESCE(drf.total_daily_referrer_fees, 0) + COALESCE(dof.total_daily_owner_fees, 0)) / 24 as hourly_fees,
          (COALESCE(drf.total_daily_referrer_fees_usd, 0) + COALESCE(dof.total_daily_owner_fees_usd, 0)) / 24 as hourly_fees_usd,
          COALESCE(drf.total_daily_referrer_fees, 0) + COALESCE(dof.total_daily_owner_fees, 0) as daily_fees,
          COALESCE(drf.total_daily_referrer_fees_usd, 0) + COALESCE(dof.total_daily_owner_fees_usd, 0) as daily_fees_usd
        FROM daily_referrer_fees_by_code_currency drf
        FULL OUTER JOIN daily_owner_fees_by_code_currency dof 
          ON drf.referral_code_id = dof.referral_code_id 
          AND drf.currency_symbol = dof.currency_symbol
        WHERE COALESCE(drf.total_daily_referrer_fees, 0) + COALESCE(dof.total_daily_owner_fees, 0) > 0
      )
      -- Insert distribution records first
      INSERT INTO rewards_distributions (batch_id, referral_code_id, currency, amount, description)
      SELECT 
        ${batchId},
        referral_code_id,
        currency_symbol,
        hourly_fees,
        ${RewardDescription.REGULAR}
      FROM hourly_fee_distributions
      WHERE hourly_fees > 0
    `.compile(trx),
    )

    // Update balances for fees based on distributions
    await trx.executeQuery(
      sql`
      INSERT INTO rewards_balances (referral_code_id, currency, balance, balance_usd, amount_per_day, amount_per_day_usd, total_earned)
      SELECT 
        rd.referral_code_id,
        rd.currency,
        SUM(rd.amount) as hourly_fees,
        -- For USD equivalent, we need to calculate from the original fee data since distributions only store asset amounts
        COALESCE(SUM(fee_usd.hourly_fees_usd), 0) as hourly_fees_usd,
        SUM(rd.amount) * 24 as daily_fees,
        COALESCE(SUM(fee_usd.hourly_fees_usd) * 24, 0) as daily_fees_usd,
        SUM(rd.amount) as hourly_fees
      FROM rewards_distributions rd
      LEFT JOIN (
        -- Calculate USD amounts for the current distributions
        WITH daily_referrer_fees_by_code_currency AS (
          SELECT
            u.referrer_id as referral_code_id,
            p.currency_symbol,
            (COALESCE(SUM(p.fees_per_day_referrer_usd), 0)) / 24 as hourly_referrer_fees_usd
          FROM users u
          INNER JOIN positions p ON u.id = p.user_id
          WHERE u.referrer_id IS NOT NULL AND u.is_active = true
          GROUP BY u.referrer_id, p.currency_symbol
        ),
        daily_owner_fees_by_code_currency AS (
          SELECT
            u.referral_code as referral_code_id,
            p.currency_symbol,
            (COALESCE(SUM(p.fees_per_day_owner_usd), 0)) / 24 as hourly_owner_fees_usd
          FROM users u
          INNER JOIN positions p ON u.id = p.user_id
          WHERE u.referral_code IS NOT NULL AND u.is_active = true
          GROUP BY u.referral_code, p.currency_symbol
        )
        SELECT
          COALESCE(drf.referral_code_id, dof.referral_code_id) as referral_code_id,
          COALESCE(drf.currency_symbol, dof.currency_symbol) as currency_symbol,
          COALESCE(drf.hourly_referrer_fees_usd, 0) + COALESCE(dof.hourly_owner_fees_usd, 0) as hourly_fees_usd
        FROM daily_referrer_fees_by_code_currency drf
        FULL OUTER JOIN daily_owner_fees_by_code_currency dof 
          ON drf.referral_code_id = dof.referral_code_id 
          AND drf.currency_symbol = dof.currency_symbol
      ) fee_usd ON rd.referral_code_id = fee_usd.referral_code_id AND rd.currency = fee_usd.currency_symbol
      WHERE rd.currency NOT IN (${RewardCurrency.POINTS}, ${RewardCurrency.SUMR})
        AND rd.description = ${RewardDescription.REGULAR}
        AND rd.batch_id = ${batchId}
      GROUP BY rd.referral_code_id, rd.currency
      ON CONFLICT (referral_code_id, currency) 
      DO UPDATE SET
        balance = rewards_balances.balance + EXCLUDED.balance,
        balance_usd = rewards_balances.balance_usd + EXCLUDED.balance_usd,
        amount_per_day = EXCLUDED.amount_per_day,
        amount_per_day_usd = EXCLUDED.amount_per_day_usd,
        total_earned = rewards_balances.total_earned + EXCLUDED.balance,
        updated_at = NOW()
    `.compile(trx),
    )

    // 4. Update referral codes last_calculated_at
    await trx.executeQuery(
      sql`
      UPDATE referral_codes 
      SET last_calculated_at = NOW()
      WHERE active_users_count > 0
    `.compile(trx),
    )
  }

  /**
   * Update daily stats within a transaction - tracks all reward types
   */
  async updateDailyStatsInTransaction(trx: Kysely<DB>): Promise<void> {
    // todo: update daily stats for historical tracking
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
      total_deposits_referred_usd: Number(result.total_deposits_referred_usd),
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

  /**
   * Helper methods for rewards balances
   */
  async getRewardsBalance(
    referralCodeId: string,
    currency: string,
  ): Promise<RewardsBalance | null> {
    const result = await this.db
      .selectFrom('rewards_balances')
      .selectAll()
      .where('referral_code_id', '=', referralCodeId)
      .where('currency', '=', currency)
      .executeTakeFirst()

    if (!result) return null

    return {
      ...result,
      balance: Number(result.balance),
      balance_usd: result.balance_usd ? Number(result.balance_usd) : null,
      amount_per_day: Number(result.amount_per_day),
      amount_per_day_usd: result.amount_per_day_usd ? Number(result.amount_per_day_usd) : null,
      total_earned: Number(result.total_earned),
      total_claimed: Number(result.total_claimed),
    }
  }

  async getAllRewardsBalances(referralCodeId: string): Promise<RewardsBalance[]> {
    const results = await this.db
      .selectFrom('rewards_balances')
      .selectAll()
      .where('referral_code_id', '=', referralCodeId)
      .execute()

    return results.map((result) => ({
      ...result,
      balance: Number(result.balance),
      balance_usd: result.balance_usd ? Number(result.balance_usd) : null,
      amount_per_day: Number(result.amount_per_day),
      amount_per_day_usd: result.amount_per_day_usd ? Number(result.amount_per_day_usd) : null,
      total_earned: Number(result.total_earned),
      total_claimed: Number(result.total_claimed),
    }))
  }

  get rawDb() {
    return this.db
  }

  /**
   * Execute operations within a transaction
   */
  async executeInTransaction<T>(callback: (trx: Kysely<DB>) => Promise<T>): Promise<T> {
    return await this.db.transaction().execute(callback)
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
        total_deposits_referred_usd: '0',
        active_users_count: 0,
      })
      .onConflict((oc) => oc.column('id').doNothing())
      .execute()
  }
}
