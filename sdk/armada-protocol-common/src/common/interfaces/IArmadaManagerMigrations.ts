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
  getMigratablePositions(params: {
    chainInfo: IChainInfo
    user: IUser
    migrationType: ArmadaMigrationType
  }): Promise<
    {
      chainInfo: IChainInfo
      tokenAmount: ITokenAmount
      migrationType: ArmadaMigrationType
    }[]
  >

  getMigrationTX(params: {
    user: IUser
    vaultId: IArmadaVaultId
    chainInfo: IChainInfo
    tokenAmount: ITokenAmount
    migrationType: ArmadaMigrationType
    shouldStake?: boolean
  }): Promise<[ApproveTransactionInfo, MigrationTransactionInfo] | [MigrationTransactionInfo]>
}
