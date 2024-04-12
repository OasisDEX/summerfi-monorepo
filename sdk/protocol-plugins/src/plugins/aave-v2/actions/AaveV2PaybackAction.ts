import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { TokenAmount } from '@summerfi/sdk-common/common'

export class AaveV2PaybackAction extends BaseAction {
  public readonly config = {
    name: 'AavePayback',
    version: 3,
    parametersAbi: '(address asset, uint256 amount, bool paybackAll)',
    storageInputs: ['amountToPayback'],
    storageOutputs: ['amountPaidBack'],
  } as const

  public encodeCall(
    params: {
      paybackAmount: TokenAmount;
      paybackAll: boolean
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          asset: params.paybackAmount.token.address,
          amount: params.paybackAmount.toBaseUnit(),
          paybackAll: params.paybackAll,
        },
      ],
      mapping: paramsMapping,
    })
  }
}
