import { Kysely, sql } from 'kysely'
import { ReferralClient } from './client'
import { DatabaseService } from './db'
import { Account, HourlySnapshot, AssetVolatility, PositionUpdate, ReferralCodeType } from './types'
import { Logger } from '@aws-lambda-powertools/logger'
import { DB } from '@summerfi/summer-beach-club-db'

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
  private readonly FEE_CONFIG: Record<
    AssetVolatility,
    Record<
      ReferralCodeType,
      {
        referrerRate: number
        ownerRate: number
      }
    >
  > = {
    [AssetVolatility.VOLATILE]: {
      [ReferralCodeType.USER]: {
        referrerRate: 0.00025, // 0.025% - 2.5bps for referrer per asset of TVL, annualised
        ownerRate: 0.00015, // 0.015% - 1.5bps for owner per asset of TVL, annualised
      },
      [ReferralCodeType.INTEGRATOR]: {
        referrerRate: 0.0005, // 0.05% - referrer tier for integrator
        ownerRate: 0, // 0% - owner tier for integrator
      },
      [ReferralCodeType.TEST]: {
        referrerRate: 0.0005, // 0.05% - referrer tier for integrator
        ownerRate: 0, // 0% - owner tier for integrator
      },
      [ReferralCodeType.INVALID]: {
        referrerRate: 0,
        ownerRate: 0,
      },
    },
    [AssetVolatility.STABLE]: {
      [ReferralCodeType.USER]: {
        referrerRate: 0.0005, // 0.05% - 5bps for referrer per asset of TVL, annualised
        ownerRate: 0.00025, // 0.025% - 2.5bps for owner per asset of TVL, annualised
      },
      [ReferralCodeType.INTEGRATOR]: {
        referrerRate: 0.001, // 0.1% - referrer tier for integrator
        ownerRate: 0, // 0% - owner tier for integrator
      },
      [ReferralCodeType.TEST]: {
        referrerRate: 0.0005, // 0.05% - referrer tier for integrator
        ownerRate: 0, // 0% - owner tier for integrator
      },
      [ReferralCodeType.INVALID]: {
        referrerRate: 0,
        ownerRate: 0,
      },
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
        // Process maximum 10 days at a time to avoid timeouts
        const maxProcessingWindow = 10 * 24 * 60 * 60 * 1000 // 10 days
        const periodEnd = new Date(
          Math.min(now.getTime(), periodStart.getTime() + maxProcessingWindow),
        )
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
    trx: Kysely<DB>,
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

        const referralTimestampDate =
          validatedReferrerId && account.referralTimestamp
            ? new Date(Number(account.referralTimestamp) * 1000)
            : null
        const referralChain =
          validatedReferrerId && account.referralChain ? account.referralChain : null

        // Insert new user or conditionally update referral fields if the user was created AFTER the referral happened
        await this.db.upsertUser(trx, {
          id: account.id,
          referrerId: validatedReferrerId,
          referralChain: referralChain,
          referralTimestamp: referralTimestampDate,
        })
      }
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

      // Step 2: Get all users that need position updates
      const allUsers = await trx
        .selectFrom('users')
        .innerJoin('referral_codes', 'referral_codes.id', 'users.referrer_id')
        .where('referrer_id', 'is not', null)
        .where('referral_timestamp', '<=', periodEnd)
        .select(['users.id as id', 'referral_codes.type as referralType'])
        .execute()

      const userIds = allUsers.map((u: any) => u.id)
      const userToReferralTypeMap = new Map<string, string>()
      for (const user of allUsers) {
        userToReferralTypeMap.set(user.id, user.referralType)
      }

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
        userToReferralTypeMap,
      )

      // Batch insert/update positions
      if (positionUpdates.length > 0) {
        await this.db.updatePositionsInTransaction(trx, positionUpdates)
      }

      // Step 4: Update users is_active flag
      this.logger.info('🔄 Updating users is_active flag...')
      await this.db.updateUsersIsActiveFlag(trx, userIds, config)

      // Step 5: Recalculate all referral stats
      this.logger.info('📊 Recalculating referral stats...')
      await this.db.recalculateReferralStatsInTransaction(trx)

      // Step 6: Update daily rates and accumulate points
      this.logger.info('💰 Updating points and daily rates...')
      await this.db.updateDailyRatesAndPointsInTransaction(trx)

      // if day has passed, update daily stats for historical tracking
      if (periodEnd.getDate() !== periodStart.getDate()) {
        this.logger.info('🔄 Updating daily stats for historical tracking...')
        // todo: update daily stats for historical tracking
      }

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
    userToReferralTypeMap: Map<string, string>,
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
              const maybeReferralType = userToReferralTypeMap.get(account.id)

              if (!maybeReferralType) {
                continue
              }

              if (
                !Object.values(ReferralCodeType).includes(maybeReferralType as ReferralCodeType)
              ) {
                continue
              }

              const referralType = maybeReferralType as ReferralCodeType
              const assetSymbol = position.vault.inputToken.symbol
              const volatility =
                assetSymbol === 'WETH' ? AssetVolatility.VOLATILE : AssetVolatility.STABLE

              const feeConfig = this.FEE_CONFIG[volatility]
              const typeConfig = feeConfig[referralType]

              const depositUsd = Number(latestSnapshot.inputTokenBalanceNormalizedInUSD || 0)
              const depositAsset = Number(latestSnapshot.inputTokenBalanceNormalized || 0)

              const dailyReferrerFeesUsd = (depositUsd * typeConfig.referrerRate) / 365
              const dailyOwnerFeesUsd = (depositUsd * typeConfig.ownerRate) / 365

              const dailyReferrerFees = (depositAsset * typeConfig.referrerRate) / 365
              const dailyOwnerFees = (depositAsset * typeConfig.ownerRate) / 365

              positionUpdates.push({
                id: position.id,
                chain: chain as any,
                user_id: account.id,
                current_deposit_usd: depositUsd.toString(),
                current_deposit_asset: depositAsset.toString(),
                currency_symbol: assetSymbol,
                fees_per_day_referrer: dailyReferrerFees.toString(),
                fees_per_day_owner: dailyOwnerFees.toString(),
                fees_per_day_referrer_usd: dailyReferrerFeesUsd.toString(),
                fees_per_day_owner_usd: dailyOwnerFeesUsd.toString(),
                is_volatile: volatility === 'volatile',
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
