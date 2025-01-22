import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import { TransactionType } from '@summerfi/sdk-common'

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
  async getApproval(
    params: Parameters<IAllowanceManager['getApproval']>[0],
  ): ReturnType<IAllowanceManager['getApproval']> {
    const erc20Contract = await this._contractsProvider.getErc20Contract({
      address: params.amount.token.address,
      chainInfo: params.chainInfo,
    })

    if (params.owner != null) {
      const allowance = await erc20Contract.allowance({
        owner: params.owner,
        spender: params.spender,
      })

      if (allowance.isGreaterOrEqualThan(params.amount)) {
        return undefined
      }
    }

    const tx = await erc20Contract.approve({
      amount: params.amount,
      spender: params.spender,
    })

    return {
      ...tx,
      type: TransactionType.Approve,
      metadata: {
        approvalAmount: params.amount,
      },
    }
  }
}
