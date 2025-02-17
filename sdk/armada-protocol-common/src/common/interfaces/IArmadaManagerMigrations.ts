import type { IChainInfo, IUser, MigrationTransactionInfo } from '@summerfi/sdk-common'
import type { ITokenAmount } from 'node_modules/@summerfi/sdk-common/dist'

/**
 * @name IArmadaManagerMigrations
 * @description Interface for the Armada Manager Migrations which handles generating transactions for migrations
 */
export interface IArmadaManagerMigrations {
  getMigratablePositions(params: { chainInfo: IChainInfo; user: IUser }): Promise<
    {
      chainInfo: IChainInfo
      tokenAmount: ITokenAmount
    }[]
  >

  getMigrationTX(params: {
    chainInfo: IChainInfo
    tokenAmount: ITokenAmount
  }): Promise<[MigrationTransactionInfo] | undefined>
}
