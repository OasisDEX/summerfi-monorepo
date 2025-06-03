import { Kysely } from 'kysely'
import { DB } from 'kysely-codegen'
import { Logger } from '@aws-lambda-powertools/logger'

export interface PointsConfig {
  processingIntervalHours: number
  activeUserThresholdUsd: number
  pointsFormulaBase: number
  pointsFormulaLogMultiplier: number
  isUpdating: boolean
}

export class ConfigService {
  constructor(
    private db: Kysely<DB>,
    private logger: Logger,
  ) {}

  async getConfig(): Promise<PointsConfig> {
    const result = await this.db
      .selectFrom('points_config')
      .select(['key', 'value'])
      .where('key', 'in', [
        'processing_interval_hours',
        'active_user_threshold_usd',
        'points_formula_base',
        'points_formula_log_multiplier',
        'run_migrations',
        'enable_backfill',
        'is_updating',
      ])
      .execute()

    const config: any = {}

    for (const row of result) {
      config[row.key] = row.value
    }

    return {
      processingIntervalHours: parseFloat(config.processing_interval_hours || '1'),
      activeUserThresholdUsd: parseFloat(config.active_user_threshold_usd || '1'),
      pointsFormulaBase: parseFloat(config.points_formula_base || '0.00005'),
      pointsFormulaLogMultiplier: parseFloat(config.points_formula_log_multiplier || '0.0005'),
      isUpdating: config.is_updating === 'true',
    }
  }

  async updateConfig(key: string, value: string): Promise<void> {
    await this.db
      .updateTable('points_config')
      .set({
        value,
        updated_at: new Date(),
      })
      .where('key', '=', key)
      .execute()
  }

  async getProcessingIntervalMs(): Promise<number> {
    const config = await this.getConfig()
    return config.processingIntervalHours * 60 * 60 * 1000
  }

  async setIsUpdating(isUpdating: boolean): Promise<void> {
    this.logger.info(`🔄 Setting is_updating to: ${isUpdating}`)

    // Ensure the record exists first
    await this.db
      .insertInto('points_config')
      .values({
        key: 'is_updating',
        value: isUpdating.toString(),
        updated_at: new Date(),
      })
      .onConflict((oc) =>
        oc.column('key').doUpdateSet({
          value: isUpdating.toString(),
          updated_at: new Date(),
        }),
      )
      .execute()

    this.logger.info(`✅ Successfully set is_updating to: ${isUpdating}`)
  }

  async getIsUpdating(): Promise<boolean> {
    // Ensure the record exists first with default value false
    await this.db
      .insertInto('points_config')
      .values({
        key: 'is_updating',
        value: 'false',
        updated_at: new Date(),
      })
      .onConflict((oc) => oc.column('key').doNothing())
      .execute()

    const config = await this.getConfig()
    this.logger.info(`📖 Retrieved is_updating flag: ${config.isUpdating}`)
    return config.isUpdating
  }
}
