import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { Address } from '@summerfi/sdk-common'
import { TokenAmount } from '@summerfi/sdk-common/common'

export class SparkWithdrawAction extends BaseAction {
  public readonly config = {
    name: 'SparkWithdraw',
    version: 0,
    parametersAbi: '(address asset, uint256 amount, address to)',
    storageInputs: [],
    storageOutputs: ['withdrawnAmount'],
  } as const

  public encodeCall(
    params: {
      withdrawAmount: TokenAmount
      withdrawTo: Address
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          asset: params.withdrawAmount.token.address.value,
          amount: params.withdrawAmount.toBaseUnit(),
          to: params.withdrawTo.value,
        },
      ],
      mapping: paramsMapping,
    })
  }
}
