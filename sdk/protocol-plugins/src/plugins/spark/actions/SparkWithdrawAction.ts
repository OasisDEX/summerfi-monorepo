import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { IAddress, ITokenAmount } from '@summerfi/sdk-common'

export class SparkWithdrawAction extends BaseAction<typeof SparkWithdrawAction.Config> {
  public static readonly Config = {
    name: 'SparkWithdraw',
    version: 0,
    parametersAbi: ['(address asset, uint256 amount, address to)'],
    storageInputs: [],
    storageOutputs: ['withdrawnAmount'],
  } as const

  public encodeCall(
    params: {
      withdrawAmount: ITokenAmount
      withdrawTo: IAddress
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          asset: params.withdrawAmount.token.address.value,
          amount: params.withdrawAmount.toSolidityValue(),
          to: params.withdrawTo.value,
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return SparkWithdrawAction.Config
  }
}
