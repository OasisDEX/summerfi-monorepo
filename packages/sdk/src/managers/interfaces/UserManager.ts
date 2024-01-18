import { Wallet } from '~sdk/common'
import { Network } from '~sdk/network'
import { User } from '~sdk/user'

/**
 * @interface UserManager
 * @description Allows to retrieve a user by their wallet and network
 */
export interface UserManager {
  /**
   * @method getUser
   * @description Retrieves a user by their wallet and network
   *
   * @param network The network to retrieve the user for
   * @param wallet The wallet to retrieve the user for
   *
   * @returns The user for the given wallet and network
   */
  getUser(params: { network: Network; wallet: Wallet }): Promise<User>
}
