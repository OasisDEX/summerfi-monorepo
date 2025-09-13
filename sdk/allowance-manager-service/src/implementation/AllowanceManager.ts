import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import type { IContractsProvider } from '@summerfi/contracts-provider-common'
import { ChainInfo, TransactionType } from '@summerfi/sdk-common'

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
  /** @see IAllowanceManager.getApproval */
  async getApproval(
    params: Parameters<IAllowanceManager['getApproval']>[0],
  ): ReturnType<IAllowanceManager['getApproval']> {
    const erc20Contract = await this._contractsProvider.getErc20Contract({
      address: params.amount.token.address,
      chainInfo: params.chainInfo,
    })

    const [allowance, approveTx] = await Promise.all([
      params.owner != null
        ? erc20Contract.allowance({
            owner: params.owner,
            spender: params.spender,
          })
        : Promise.resolve(null),
      erc20Contract.approve({
        amount: params.amount,
        spender: params.spender,
      }),
    ])

    console.log('allowance check:', {
      chainInfo: params.chainInfo.name,
      token: params.amount.token.toString(),
      allowance: allowance,
      amount: params.amount.toString(),
    })

    if (allowance != null && allowance.isGreaterOrEqualThan(params.amount)) {
      return undefined
    }

    return {
      ...approveTx,
      type: TransactionType.Approve,
      metadata: {
        approvalAmount: params.amount,
        approvalSpender: params.spender,
      },
    }
  }
}
