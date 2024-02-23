import { ActionCall, BaseAction } from '~orderplanner/actions'
import { TokenAmount } from '@summerfi/sdk-common/common'
import { Address } from 'viem'

export class SparkBorrowAction extends BaseAction {
  public readonly config = {
    name: 'SparkBorrow',
    version: 1,
    parametersAbi: 'address asset, uint256 amount, address to',
    storageInputs: [],
    storageOutputs: ['borrowedAmount'],
  } as const

  public encodeCall(params: { borrowAmount: TokenAmount; borrowTo: Address }): ActionCall {
    return this._encodeCall([
      params.borrowAmount.token.address.toString(),
      params.borrowAmount.toBaseUnit(),
      params.borrowTo.toString(),
    ])
  }
}
