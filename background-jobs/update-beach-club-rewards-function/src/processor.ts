import { ReferralClient } from './client'
import { DatabaseService, PositionUpdate } from './db'
import { Account, HourlySnapshot } from './types'
import { Logger } from '@aws-lambda-powertools/logger'

export interface ProcessingResult {
  success: boolean
  usersProcessed: number
  activeUsers: number
  periodStart: Date
  periodEnd: Date
  error?: Error
}

export interface ProcessorConfig {
  logger?: Logger
}

export class ReferralProcessor {
  private db: DatabaseService
  private client: ReferralClient
  private logger: Logger
  private referralStartDate: Date

  // Fee configuration for vault types
  private readonly FEE_CONFIG = {
    volatile: {
      feeTier: 0.003, // 0.3% - base fee tier for volatile vaults (ETH etc)
      referrerRate: 0.00025, // 0.025% - 2.5bps for referrer per asset of TVL, annualised
      ownerRate: 0.00015, // 0.015% - 1.5bps for receiver per asset of TVL, annualised
    },
    stable: {
      feeTier: 0.01, // 1% - base fee tier for stable vaults (USDC, USDT, EURC etc)
      referrerRate: 0.0005, // 0.05% - 5bps for referrer per asset of TVL, annualised
      ownerRate: 0.00025, // 0.025% - 2.5bps for receiver per asset of TVL, annualised
    },
  } as const

  constructor(config?: ProcessorConfig) {
    this.db = new DatabaseService()
    this.client = new ReferralClient()
    this.logger =
      config?.logger ||
      new Logger({ serviceName: 'update-beach-club-rewards-function', logLevel: 'DEBUG' })
    this.referralStartDate = new Date('2025-05-27')
  }

  /**
   * Process the latest period since last execution
   */
  async processLatest(): Promise<ProcessingResult> {
    this.logger.info('🚀 Processing latest referral points...')

    // Safety check - ensure we're not already processing
    const isUpdating = await this.db.config.getIsUpdating()
    this.logger.info(`🔍 Current is_updating flag: ${isUpdating}`)

    if (isUpdating) {
      this.logger.info('⚠️ Processing already in progress - skipping this run')
      return {
        success: true,
        usersProcessed: 0,
        activeUsers: 0,
        periodStart: new Date(),
        periodEnd: new Date(),
      }
    }

    try {
      // Set updating flag to true
      await this.db.config.setIsUpdating(true)
      this.logger.info('🔒 Set processing lock to true')

      // Verify the flag was set
      const verifyFlag = await this.db.config.getIsUpdating()
      this.logger.info(`✅ Verified is_updating flag: ${verifyFlag}`)

      return await this.db.executeInTransaction(async (trx) => {
        const lastProcessed = await this.db.getLastProcessedTimestampInTransaction(trx)
        const now = new Date()
        now.setMinutes(0, 0, 0) // Round down to hour

        let periodStart: Date
        if (!lastProcessed) {
          periodStart = this.referralStartDate
          this.logger.info('📍 First run - processing from referral start date')
        } else {
          periodStart = lastProcessed
        }

        const periodEnd = now

        this.logger.info(`📅 Processing Period:`)
        this.logger.info(`   From: ${periodStart.toISOString()}`)
        this.logger.info(`   To:   ${periodEnd.toISOString()}`)

        if (periodStart >= periodEnd) {
          this.logger.info('⏰ No new data to process')
          return {
            success: true,
            usersProcessed: 0,
            activeUsers: 0,
            periodStart,
            periodEnd,
          }
        }

        const newUsers = await this.processNewUsersInTransaction(trx, periodStart, periodEnd)
        if (!newUsers.success) {
          throw new Error(`Processing failed: ${newUsers.error?.message}`)
        }

        // if period is longer than 1 hour, we need to process it in chunks of 1 hour
        if (periodEnd.getTime() - periodStart.getTime() > 1 * 60 * 60 * 1000) {
          const chunks = Math.ceil(
            (periodEnd.getTime() - periodStart.getTime()) / (1 * 60 * 60 * 1000),
          )
          for (let i = 0; i < chunks; i++) {
            const chunkStart = new Date(periodStart.getTime() + i * 1 * 60 * 60 * 1000)
            const chunkEnd = new Date(periodStart.getTime() + (i + 1) * 1 * 60 * 60 * 1000)
            const result = await this.processPeriodInTransaction(trx, chunkStart, chunkEnd)
            if (!result.success) {
              throw new Error(`Processing failed for chunk: ${result.error?.message}`)
            } else {
              await trx
                .insertInto('processing_checkpoint')
                .values({
                  last_processed_timestamp: chunkEnd,
                })
                .execute()
              this.logger.info(`✅ Checkpoint updated to: ${chunkEnd.toISOString()}`)
            }
          }
        } else {
          const result = await this.processPeriodInTransaction(trx, periodStart, periodEnd)
          if (!result.success) {
            throw new Error(`Processing failed: ${result.error?.message}`)
          } else {
            await trx
              .insertInto('processing_checkpoint')
              .values({
                last_processed_timestamp: periodEnd,
              })
              .execute()
            this.logger.info(`✅ Checkpoint updated to: ${periodEnd.toISOString()}`)
          }
        }

        return {
          success: true,
          usersProcessed: 0,
          activeUsers: 0,
          periodStart,
          periodEnd,
        }
      })
    } catch (error) {
      this.logger.error('❌ Processing failed:', { error: error as Error })
      return {
        success: false,
        usersProcessed: 0,
        activeUsers: 0,
        periodStart: new Date(),
        periodEnd: new Date(),
        error: error as Error,
      }
    } finally {
      // Always clear the updating flag
      this.logger.info('🔓 Releasing processing lock...')
      await this.db.config.setIsUpdating(false)

      // Verify the flag was cleared
      const verifyCleared = await this.db.config.getIsUpdating()
      this.logger.info(`✅ Verified is_updating flag after clear: ${verifyCleared}`)
    }
  }

  /**
   * Process a specific time period
   */
  async processPeriod(periodStart: Date, periodEnd: Date): Promise<ProcessingResult> {
    return await this.db.executeInTransaction(async (trx) => {
      return await this.processPeriodInTransaction(trx, periodStart, periodEnd)
    })
  }

  async processNewUsersInTransaction(
    trx: any,
    periodStart: Date,
    periodEnd: Date,
  ): Promise<ProcessingResult> {
    // Step 1: Fetch new referred accounts in this period
    const timestampGt = BigInt(Math.floor(periodStart.getTime() / 1000))
    const timestampLt = BigInt(Math.floor(periodEnd.getTime() / 1000))

    this.logger.info(`📡 Fetching newly referred accounts in this period...`)
    const { validAccounts } = await this.client.getValidReferredAccounts(timestampGt, timestampLt)

    this.logger.info(`📊 Found ${validAccounts.length} new valid referred accounts`)

    // Store new users - batch insert for better performance
    if (validAccounts.length > 0) {
      // First, validate all referral codes and prepare user data
      const userValues = []

      for (const account of validAccounts) {
        let validatedReferrerId: string | null = null

        if (account.referralData?.id) {
          validatedReferrerId = await this.db.validateReferralCodeInTransaction(
            trx,
            account.referralData.id,
          )
          this.logger.info(
            `Validated referral code ${account.referralData.id} -> ${validatedReferrerId}`,
          )
        }

        userValues.push({
          id: account.id,
          referrer_id: validatedReferrerId,
          referral_chain: validatedReferrerId ? account.referralChain : null,
          referral_timestamp: validatedReferrerId
            ? new Date(Number(account.referralTimestamp) * 1000)
            : null,
          is_active: false,
        })
      }

      await trx
        .insertInto('users')
        .values(userValues)
        .onConflict((oc: any) => oc.doNothing())
        .execute()
    }

    return {
      success: true,
      usersProcessed: validAccounts.length,
      activeUsers: 0,
      periodStart,
      periodEnd,
    }
  }

  /**
   * Process a specific time period within a transaction
   */
  async processPeriodInTransaction(
    trx: any,
    periodStart: Date,
    periodEnd: Date,
  ): Promise<ProcessingResult> {
    this.logger.info(
      `\n🔄 Processing period: ${periodStart.toISOString()} → ${periodEnd.toISOString()}`,
    )

    try {
      // Update user totals for all affected users
      const config = await this.db.config.getConfig()

      // // Step 1: Fetch new referred accounts in this period
      const timestampGt = BigInt(Math.floor(periodStart.getTime() / 1000))
      const timestampLt = BigInt(Math.floor(periodEnd.getTime() / 1000))

      // this.logger.info(`📡 Fetching newly referred accounts in this period...`)
      // const { validAccounts } = await this.client.getValidReferredAccounts(timestampGt, timestampLt)

      // this.logger.info(`📊 Found ${validAccounts.length} new valid referred accounts`)

      // // Store new users - batch insert for better performance
      // if (validAccounts.length > 0) {
      //   // First, validate all referral codes and prepare user data
      //   const userValues = []

      //   for (const account of validAccounts) {
      //     let validatedReferrerId: string | null = null

      //     if (account.referralData?.id) {
      //       validatedReferrerId = await this.db.validateReferralCodeInTransaction(trx, account.referralData.id)
      //       this.logger.info(`Validated referral code ${account.referralData.id} -> ${validatedReferrerId}`)
      //     }

      //     userValues.push({
      //       id: account.id,
      //       referrer_id: validatedReferrerId,
      //       referral_chain: validatedReferrerId ? account.referralChain : null,
      //       referral_timestamp: validatedReferrerId
      //         ? new Date(Number(account.referralTimestamp) * 1000)
      //         : null,
      //       is_active: false,
      //     })
      //   }

      //   await trx
      //     .insertInto('users')
      //     .values(userValues)
      //     .onConflict((oc: any) => oc.doNothing())
      //     .execute()
      // }

      // Step 2: Get all users that need position updates
      const allUsers = await trx
        .selectFrom('users')
        .where('referrer_id', 'is not', null)
        .where('referral_timestamp', '<=', periodEnd)
        .select('id')
        .execute()

      const userIds = allUsers.map((u: any) => u.id)
      this.logger.info(`📊 Updating positions for ${userIds.length} users...`)

      // Step 3: Fetch and update positions
      const positionsByChain = await this.client.getAllPositionsWithHourlySnapshots(userIds, {
        timestampGt,
        timestampLt,
      })

      // Prepare batch position updates
      const positionUpdates: Array<PositionUpdate> = this.preparePositionsUpdateData(
        positionsByChain,
        periodStart,
        periodEnd,
      )

      // Batch insert/update positions
      if (positionUpdates.length > 0) {
        await this.db.updatePositionsInTransaction(trx, positionUpdates)
      }

      // Update user totals for all affected users
      await this.db.updateUserTotalsInTransaction(trx, userIds, config)

      // Step 4: Recalculate all referral stats
      this.logger.info('📊 Recalculating referral stats...')
      await this.db.recalculateReferralStatsInTransaction(trx)

      // Step 5: Update daily rates and accumulate points
      this.logger.info('💰 Updating points and daily rates...')
      await this.db.updateDailyRatesAndPointsInTransaction(trx)

      // Step 6: Update daily stats for historical tracking
      await this.db.updateDailyStatsInTransaction(trx)

      // Get final stats
      const activeUsersResult = await trx
        .selectFrom('users')
        .select((eb: any) => eb.fn.count('id').as('count'))
        .where('is_active', '=', true)
        .executeTakeFirst()

      const activeUsers = Number(activeUsersResult?.count || 0)

      this.logger.info(
        `✅ Period complete: ${userIds.length} users processed, ${activeUsers} active users`,
      )

      return {
        success: true,
        usersProcessed: userIds.length,
        activeUsers,
        periodStart,
        periodEnd,
      }
    } catch (error) {
      this.logger.error('❌ Error during period processing:', { error: error as Error })
      return {
        success: false,
        usersProcessed: 0,
        activeUsers: 0,
        periodStart,
        periodEnd,
        error: error as Error,
      }
    }
  }

  private preparePositionsUpdateData(
    positionsByChain: { [chain: string]: Account[] },
    periodStart: Date,
    periodEnd: Date,
  ) {
    const positionUpdates: Array<PositionUpdate> = []

    // Update positions and user totals
    for (const [chain, accounts] of Object.entries(positionsByChain)) {
      for (const account of accounts) {
        if (account.positions) {
          for (const position of account.positions) {
            // Find the latest snapshot in the period
            const latestSnapshot = this.getLatestSnapshot(
              position.hourlySnapshots,
              periodStart,
              periodEnd,
            )
            if (latestSnapshot) {
              const depositUsd = Number(latestSnapshot.inputTokenBalanceNormalizedInUSD || 0)
              const isVolatile = position.vault.inputToken.symbol === 'WETH'

              const feeTier = isVolatile
                ? this.FEE_CONFIG.volatile.feeTier
                : this.FEE_CONFIG.stable.feeTier
              const dailyFeeGeneratedByThePosition = (depositUsd * feeTier) / 365
              const dailyReferrerFees =
                dailyFeeGeneratedByThePosition *
                (isVolatile
                  ? this.FEE_CONFIG.volatile.referrerRate
                  : this.FEE_CONFIG.stable.referrerRate)
              const dailyOwnerFees =
                dailyFeeGeneratedByThePosition *
                (isVolatile ? this.FEE_CONFIG.volatile.ownerRate : this.FEE_CONFIG.stable.ownerRate)

              positionUpdates.push({
                id: position.id,
                chain: chain as any,
                user_id: account.id,
                current_deposit_usd: depositUsd.toString(),
                fees_per_day_referrer: dailyReferrerFees.toString(),
                fees_per_day_owner: dailyOwnerFees.toString(),
                is_volatile: isVolatile,
                last_synced_at: new Date(),
              })
            }
          }
        }
      }
    }
    return positionUpdates
  }

  /**
   * Get the latest snapshot within a time period
   */
  private getLatestSnapshot(
    snapshots: HourlySnapshot[] | undefined,
    periodStart: Date,
    periodEnd: Date,
  ): HourlySnapshot | null {
    if (!snapshots || snapshots.length === 0) return null
    const relevantSnapshots = snapshots.filter((snapshot) => {
      const snapshotTime = new Date(Number(snapshot.timestamp) * 1000)
      return snapshotTime >= periodStart && snapshotTime <= periodEnd
    })

    if (relevantSnapshots.length === 0) return null

    return relevantSnapshots.reduce((latest, current) => {
      return Number(current.timestamp) > Number(latest.timestamp) ? current : latest
    })
  }

  /**
   * Clean up resources
   */
  async close(): Promise<void> {
    await this.db.close()
  }
}
