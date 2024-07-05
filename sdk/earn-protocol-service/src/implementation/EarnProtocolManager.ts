import { IConfigurationProvider } from '@summerfi/configuration-provider'
import type { IEarnProtocolManager } from '@summerfi/earn-protocol-common'
import { IChainInfo, ITokenAmount, IUser, TransactionInfo } from '@summerfi/sdk-common'

/**
 * @name EarnProtocolManager
 * @description This class is the implementation of the IEarnProtocolManager interface. Takes care of choosing the best provider for a price consultation
 */
export class EarnProtocolManager implements IEarnProtocolManager {
  private _configProvider: IConfigurationProvider

  /** CONSTRUCTOR */
  constructor(params: { configProvider: IConfigurationProvider }) {
    this._configProvider = params.configProvider
  }

  /** FUNCTIONS */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deposit(params: {
    chainInfo: IChainInfo
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    return []
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async withdraw(params: {
    chainInfo: IChainInfo
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    return []
  }
}
