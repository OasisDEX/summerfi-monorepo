import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { Address, TokenAmount } from '@summerfi/sdk-common/common'

export class CompoundV3PaybackAction extends BaseAction {
  public readonly config = {
    name: 'CompoundV3Payback',
    version: 0,
    parametersAbi: '(address comet, address asset, uint256 amount, bool paybackAll)',
    storageInputs: [],
    storageOutputs: ['amountPaidBack'],
  } as const

  public encodeCall(
    params: {
      comet: Address
      paybackAmount: TokenAmount
      paybackAll: boolean
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          comet: params.comet.value,
          asset: params.paybackAmount.token.address.value,
          amount: params.paybackAmount.toBaseUnit(),
          paybackAll: params.paybackAll,
        },
      ],
      mapping: paramsMapping,
    })
  }
}
