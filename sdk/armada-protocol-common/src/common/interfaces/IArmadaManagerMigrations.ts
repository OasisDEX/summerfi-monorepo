import type {
  IChainInfo,
  IUser,
  MigrationTransactionInfo,
  ITokenAmount,
  ArmadaMigrationType,
  ApproveTransactionInfo,
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
    migrationType: ArmadaMigrationType
  }): Promise<
    {
      chainInfo: IChainInfo
      amount: ITokenAmount
      migrationType: ArmadaMigrationType
    }[]
  >

  /**
   * @method getMigrationTX
   * @description Returns the transaction for the migration
   *
   * @param user The user
   * @param vaultId The vault id
   * @param chainInfo Chain information
   * @param amount The token amount
   * @param migrationType The type of migration
   * @param shouldStake Should stake
   *
   * @returns The transaction for the migration
   * @throws Error if the migration type is not supported
   */
  getMigrationTX(params: {
    user: IUser
    vaultId: IArmadaVaultId
    chainInfo: IChainInfo
    amount: ITokenAmount
    migrationType: ArmadaMigrationType
    shouldStake?: boolean
  }): Promise<[ApproveTransactionInfo, MigrationTransactionInfo] | [MigrationTransactionInfo]>
}
