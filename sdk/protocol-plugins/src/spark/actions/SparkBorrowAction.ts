import { ActionCall, BaseAction } from '@summerfi/order-planner-common/actions'
import { Address, TokenAmount } from '@summerfi/sdk-common/common/implementation'

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
