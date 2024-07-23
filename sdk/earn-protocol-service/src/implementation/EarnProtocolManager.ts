import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import type { IEarnProtocolManager } from '@summerfi/earn-protocol-common'
import { IAddress, IChainInfo, ITokenAmount, IUser, TransactionInfo } from '@summerfi/sdk-common'

import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import { IContractsProvider } from '@summerfi/contracts-provider-common'

/**
 * @name EarnProtocolManager
 * @description This class is the implementation of the IEarnProtocolManager interface. Takes care of choosing the best provider for a price consultation
 */
export class EarnProtocolManager implements IEarnProtocolManager {
  private _configProvider: IConfigurationProvider
  private _allowanceManager: IAllowanceManager
  private _contractsProvider: IContractsProvider

  /** CONSTRUCTOR */
  constructor(params: {
    configProvider: IConfigurationProvider
    allowanceManager: IAllowanceManager
    contractsProvider: IContractsProvider
  }) {
    this._configProvider = params.configProvider
    this._allowanceManager = params.allowanceManager
    this._contractsProvider = params.contractsProvider
  }

  /** FUNCTIONS */

  /** @see IEarnProtocolManager.deposit */
  async deposit(params: {
    chainInfo: IChainInfo
    fleetAddress: IAddress
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    const transactions: TransactionInfo[] = []

    // Allowance
    const allowanceTransaction = await this._allowanceManager.getAllowance({
      chainInfo: params.chainInfo,
      spender: params.fleetAddress,
      amount: params.amount,
    })
    if (allowanceTransaction) {
      transactions.push(...allowanceTransaction)
    }

    // Deposit
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.chainInfo,
      address: params.fleetAddress,
    })

    const fleetDepositTransaction = await fleetContract.deposit({
      assets: params.amount,
      receiver: params.user.wallet.address,
    })

    transactions.push(fleetDepositTransaction)

    return transactions
  }

  /** @see IEarnProtocolManager.withdraw */
  async withdraw(params: {
    chainInfo: IChainInfo
    fleetAddress: IAddress
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    const fleetContract = await this._contractsProvider.getFleetCommanderContract({
      chainInfo: params.chainInfo,
      address: params.fleetAddress,
    })

    const fleetWithdrawTransaction = await fleetContract.withdraw({
      assets: params.amount,
      receiver: params.user.wallet.address,
      owner: params.user.wallet.address,
    })

    return [fleetWithdrawTransaction]
  }
}
