import { IConfigurationProvider } from '@summerfi/configuration-provider'
import type { IAllowanceManager } from '@summerfi/allowance-common'
import { IAddress, IChainInfo, ITokenAmount, TransactionInfo } from '@summerfi/sdk-common'

import { encodeFunctionData, erc20Abi } from 'viem'

/**
 * @name AllowanceManager
 * @description This class is the implementation of the IAllowanceManager interface. Takes care of generating transactions for setting an allowance
 */
export class AllowanceManager implements IAllowanceManager {
  private _configProvider: IConfigurationProvider

  /** CONSTRUCTOR */
  constructor(params: { configProvider: IConfigurationProvider }) {
    this._configProvider = params.configProvider
  }

  /** FUNCTIONS */
  async getAllowance(params: {
    chainInfo: IChainInfo
    spender: IAddress
    amount: ITokenAmount
  }): Promise<TransactionInfo[]> {
    const calldata = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'approve',
      args: [params.spender.value, BigInt(params.amount.toBaseUnit())],
    })

    return [
      {
        transaction: {
          target: params.amount.token.address,
          calldata: calldata,
          value: '0',
        },
        description:
          'Approve spending of ' +
          params.amount.toString() +
          ' to the spender at address: ' +
          params.spender.value,
      },
    ]
  }
}
