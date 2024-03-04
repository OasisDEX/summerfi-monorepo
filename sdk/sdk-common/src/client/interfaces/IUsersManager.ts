import type { Chain } from '~sdk-common/client/implementation/Chain'
import type { User } from '~sdk-common/client/implementation/User'
import { Wallet } from '~sdk-common/common/implementation/Wallet'

/**
 * @interface IUsersManager
 * @description Allows to retrieve a user by their wallet and network
 */
export interface IUsersManager {
  /**
   * @method getUser
   * @description Retrieves a user by their wallet and network
   *
   * @param chain The chain to retrieve the user for
   * @param wallet The wallet to retrieve the user for
   *
   * @returns The user for the given wallet and network
   */
  getUser(params: { chain: Chain; wallet: Wallet }): Promise<User>
}
