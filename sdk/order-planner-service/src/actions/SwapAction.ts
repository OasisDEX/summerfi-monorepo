import { ActionCall, BaseAction } from '@summerfi/order-planner-common/actions'
import { Percentage, TokenAmount } from '@summerfi/sdk-common/common'
import { HexData } from '@summerfi/sdk-common/common/aliases'

export class SwapAction extends BaseAction {
  public readonly config = {
    name: 'SwapAction',
    version: 1,
    parametersAbi: 'address, address, uint256, uint256, uint256, bytes, bool',
    storageInputs: [],
    storageOutputs: ['received'],
  } as const

  public encodeCall(
    params: {
      fromAmount: TokenAmount
      toMinimumAmount: TokenAmount
      fee: Percentage
      withData: HexData
      collectFeeInFromToken: boolean
    },
    paramsMapping?: number[],
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        params.fromAmount.token.address.value,
        params.toMinimumAmount.token.address.value,
        params.fromAmount.toBaseUnit(),
        params.toMinimumAmount.toBaseUnit(),
        params.fee.toBaseUnit({ decimals: 8 }),
        params.withData,
        params.collectFeeInFromToken,
      ],
      mapping: paramsMapping,
    })
  }
}
