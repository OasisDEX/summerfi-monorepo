import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { TokenAmount } from '@summerfi/sdk-common/common'

export class AaveV3PaybackAction extends BaseAction {
  public readonly config = {
    name: 'AaveV3Payback',
    version: 0,
    parametersAbi: '(address asset, uint256 amount, bool paybackAll)',
    storageInputs: ['asset', 'amountToPayback'],
    storageOutputs: ['paybackedAmount'],
  } as const

  public encodeCall(
    params: {
      paybackAmount: TokenAmount
      paybackAll: boolean
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          asset: params.paybackAmount.token.address.value,
          amount: params.paybackAmount.toBaseUnit(),
          paybackAll: params.paybackAll,
        },
      ],
      mapping: paramsMapping,
    })
  }
}
