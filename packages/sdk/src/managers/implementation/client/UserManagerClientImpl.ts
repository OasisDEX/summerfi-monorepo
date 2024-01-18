import { Wallet } from '~sdk/common'
import { UserManager } from '~sdk/managers'
import { Network } from '~sdk/network'
import { User } from '~sdk/user'

/**
 * @class UserManagerClientImpl
 * @see UserManager
 */
export class UserManagerClientImpl implements UserManager {
  /// Class Attributes
  private static _instance: UserManagerClientImpl

  /// Constructor
  private constructor() {
    // Empty on purpose
  }

  /// Instance Methods

  /**
   * @method getUser
   * @see UserManager#getUser
   */
  public async getUser(params: { network: Network; wallet: Wallet }): Promise<User> {
    // TODO: Implement
    return {} as User
  }

  /// Static Methods

  public static getInstance(): UserManagerClientImpl {
    if (!this._instance) {
      this._instance = new UserManagerClientImpl()
    }
    return this._instance
  }
}
