import { ActionCall, BaseAction } from '@summerfi/protocol-plugins-common'
import { Address, TokenAmount } from '@summerfi/sdk-common/common'

export class SparkBorrowAction extends BaseAction {
  public readonly config = {
    name: 'SparkBorrow',
    version: 2,
    parametersAbi: 'address asset, uint256 amount, address to',
    storageInputs: [],
    storageOutputs: ['borrowedAmount'],
  } as const

  public encodeCall(
    params: { borrowAmount: TokenAmount; borrowTo: Address },
    paramsMapping?: number[],
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        params.borrowAmount.token.address.value,
        params.borrowAmount.toBaseUnit(),
        params.borrowTo.value,
      ],
      mapping: paramsMapping,
    })
  }
}
