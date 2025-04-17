import { Address, ChainInfo } from '@summerfi/sdk-common'
import { IUser } from '@summerfi/sdk-common'
import type { IUserClient } from './IUserClient'

/**
 * @interface IUsersManager
 * @description Allows to retrieve a user by their wallet and network
 */
export interface IUsersManager {
  /**
   * @method getUserClient
   * @description Retrieves a user by their wallet and network
   *
   * @param chainInfo The chain to retrieve the user for
   * @param walletAddress The wallet to retrieve the user for
   *
   * @returns The user for the given wallet and network
   */
  getUserClient(params: { chainInfo: ChainInfo; walletAddress: Address }): Promise<IUserClient>
}
