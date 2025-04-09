import type {
  IChainInfo,
  IUser,
  MigrationTransactionInfo,
  ArmadaMigrationType,
  ApproveTransactionInfo,
  IPercentage,
  ArmadaMigratablePosition,
  AddressValue,
  ArmadaMigratablePositionApy,
  IArmadaVaultId,
} from '@summerfi/sdk-common'

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
    positions: ArmadaMigratablePosition[]
  }>

  /**
   * @method getMigratablePositionsApy
   * @description Returns the APY for the positions that can be migrated
   *
   * @param chainInfo Chain information
   * @param positionIds The positions to get the APY for
   *
   * @returns The APY for the positions that can be migrated
   */
  getMigratablePositionsApy(params: {
    chainInfo: IChainInfo
    positionIds: AddressValue[]
  }): Promise<{
    chainInfo: IChainInfo
    apyByPositionId: Record<string, ArmadaMigratablePositionApy>
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
    positionIds: AddressValue[]
  }): Promise<[ApproveTransactionInfo[], MigrationTransactionInfo] | [MigrationTransactionInfo]>
}
