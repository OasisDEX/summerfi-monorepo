import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { ITokenAmount } from '@summerfi/sdk-common/common'

export class SparkPaybackAction extends BaseAction<typeof SparkPaybackAction.Config> {
  public static readonly Config = {
    name: 'SparkPayback',
    version: 2,
    parametersAbi: ['(address asset, uint256 amount, bool paybackAll)'],
    storageInputs: ['asset', 'amountToPayback'],
    storageOutputs: ['paybackedAmount'],
  } as const

  public encodeCall(
    params: {
      paybackAmount: ITokenAmount
      paybackAll: boolean
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          asset: params.paybackAmount.token.address.value,
          amount: BigInt(params.paybackAmount.toBaseUnit()),
          paybackAll: params.paybackAll,
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return SparkPaybackAction.Config
  }
}
