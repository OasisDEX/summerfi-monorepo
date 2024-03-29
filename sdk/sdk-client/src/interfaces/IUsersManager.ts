import { Address, ChainInfo } from '@summerfi/sdk-common/common'
import { IUser } from '@summerfi/sdk-common/user'

/**
 * @interface IUsersManager
 * @description Allows to retrieve a user by their wallet and network
 */
export interface IUsersManager {
  /**
   * @method getUser
   * @description Retrieves a user by their wallet and network
   *
   * @param chainInfo The chain to retrieve the user for
   * @param wallet The wallet to retrieve the user for
   *
   * @returns The user for the given wallet and network
   */
  getUser(params: { chainInfo: ChainInfo; walletAddress: Address }): Promise<IUser>
}
