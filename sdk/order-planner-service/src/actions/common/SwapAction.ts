import { ActionCall, BaseAction } from '~orderplanner/actions'
import { Percentage, TokenAmount } from '@summerfi/sdk-common/common'
import { Hex } from 'viem'

export class SwapAction extends BaseAction {
  public readonly config = {
    name: 'SwapAction',
    version: 1,
    parametersAbi: 'address, address, uint256, uint256, uint256, bytes, bool',
    storageInputs: [],
    storageOutputs: ['received'],
  } as const

  public encodeCall(params: {
    fromAmount: TokenAmount
    toMinimumAmount: TokenAmount
    fee: Percentage
    withData: Hex
    collectFeeInFromToken: boolean
  }): ActionCall {
    return this._encodeCall([
      params.fromAmount.token.address.hexValue,
      params.toMinimumAmount.token.address.hexValue,
      params.fromAmount.toBaseUnit(),
      params.toMinimumAmount.toBaseUnit(),
      params.fee.toBaseUnit({ decimals: 8 }),
      params.withData,
      params.collectFeeInFromToken,
    ])
  }
}
