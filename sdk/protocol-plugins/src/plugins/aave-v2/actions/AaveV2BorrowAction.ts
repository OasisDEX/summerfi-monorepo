import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { Address, TokenAmount } from '@summerfi/sdk-common/common'

export class AaveV2BorrowAction extends BaseAction {
  public readonly config = {
    name: 'AaveBorrow',
    version: 3,
    parametersAbi: '(address asset, uint256 amount, address to)',
    storageInputs: [],
    storageOutputs: ['borrowedAmount'],
  } as const

  public encodeCall(
    params: { borrowAmount: TokenAmount; borrowTo: Address },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          asset: params.borrowAmount.token.address.value,
          amount: params.borrowAmount.toBaseUnit(),
          to: params.borrowTo.value,
        },
      ],
      mapping: paramsMapping,
    })
  }
}
