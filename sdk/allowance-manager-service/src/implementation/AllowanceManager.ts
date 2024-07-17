import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import { IAddress, IChainInfo, ITokenAmount, TransactionInfo } from '@summerfi/sdk-common'

/**
 * @name AllowanceManager
 * @description This class is the implementation of the IAllowanceManager interface. Takes care of generating transactions for setting an allowance
 */
export class AllowanceManager implements IAllowanceManager {
  private _configProvider: IConfigurationProvider
  private _contractsProvider: IContractsProvider

  /** CONSTRUCTOR */
  constructor(params: {
    configProvider: IConfigurationProvider
    contractsProvider: IContractsProvider
  }) {
    this._configProvider = params.configProvider
    this._contractsProvider = params.contractsProvider
  }

  /** FUNCTIONS */
  async getAllowance(params: {
    chainInfo: IChainInfo
    spender: IAddress
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    const erc20Contract = await this._contractsProvider.getErc20Contract({
      address: params.amount.token.address,
      chainInfo: params.chainInfo,
    })

    return [
      await erc20Contract.approve({
        amount: params.amount,
        spender: params.spender,
      }),
    ]
  }
}
