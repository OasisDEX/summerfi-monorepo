import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { Address, TokenAmount } from '@summerfi/sdk-common/common'

export class CompoundV3BorrowAction extends BaseAction {
  public readonly config = {
    name: 'CompoundV3Borrow',
    version: 0,
    parametersAbi: '(address comet, address asset, uint256 amount)',
    storageInputs: [],
    storageOutputs: ['borrowedAmount'],
  } as const

  public encodeCall(
    params: {
      comet: Address
      borrowAmount: TokenAmount
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          comet: params.comet.value,
          asset: params.borrowAmount.token.address.value,
          amount: params.borrowAmount.toBaseUnit(),
        },
      ],
      mapping: paramsMapping,
    })
  }
}
