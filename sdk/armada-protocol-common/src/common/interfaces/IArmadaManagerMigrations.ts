import type {
  IChainInfo,
  IUser,
  MigrationTransactionInfo,
  ITokenAmount,
  ArmadaMigrationType,
  ApproveTransactionInfo,
  IPercentage,
} from '@summerfi/sdk-common'
import type { IArmadaVaultId } from './IArmadaVaultId'

/**
 * @name IArmadaManagerMigrations
 * @description Interface for the Armada Manager Migrations which handles generating transactions for migrations
 */
export interface IArmadaManagerMigrations {
  /**
   * @method getMigratablePositions
   * @description Returns the positions that can be migrated
   *
   * @param chainInfo Chain information
   * @param user The user
   * @param migrationType The type of migration
   *
   * @returns The positions that can be migrated
   * @throws Error if the migration type is not supported
   */
  getMigratablePositions(params: {
    chainInfo: IChainInfo
    user: IUser
    migrationType?: ArmadaMigrationType
  }): Promise<{
    chainInfo: IChainInfo
    positions: {
      migrationType: ArmadaMigrationType
      amount: ITokenAmount
      underlyingAmount: ITokenAmount
    }[]
  }>

  /**
   * @method getMigrationTX
   * @description Returns the transaction for the migration
   *
   * @param user The user
   * @param vaultId The vault id
   * @param shouldStake Should stake
   * @param slippage The slippage
   * @param positions The positions to migrate
   *
   * @returns The transaction for the migration
   * @throws Error if the migration type is not supported
   */
  getMigrationTX(params: {
    user: IUser
    vaultId: IArmadaVaultId
    shouldStake?: boolean
    slippage: IPercentage
    positions: {
      migrationType: ArmadaMigrationType
      amount: ITokenAmount
      underlyingAmount: ITokenAmount
    }[]
  }): Promise<[ApproveTransactionInfo[], MigrationTransactionInfo] | [MigrationTransactionInfo]>

  /**
   * @method calculateTotal
   * @description Returns the total value of positions in USD
   *
   * @param positions List of positions to calculate total for
   *
   * @returns The total value in USD
   */
  calculateTotal(params: {
    positions: {
      migrationType: ArmadaMigrationType
      amount: ITokenAmount
      underlyingAmount: ITokenAmount
    }[]
  }): Promise<{ totalUsd: string }>
}
